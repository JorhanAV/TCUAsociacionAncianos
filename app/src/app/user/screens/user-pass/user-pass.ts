import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../share/services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-pass',
  standalone: false,
  templateUrl: './user-pass.html',
  styleUrl: './user-pass.scss',
})
export class UserPass {
  fb = inject(FormBuilder);
  usuarioService = inject(UsuarioService);
  snack = inject(MatSnackBar);

  cargando = false;

  showActual = false;
  showNueva = false;
  showConfirm = false;

  form: FormGroup = this.fb.group(
    {
      actual: ['', Validators.required],
      nueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', Validators.required],
    },
    { validators: this.matchPasswords }
  );

  // =====================================
  // VALIDACIÓN: confirmación de contraseña
  // =====================================
  matchPasswords(group: FormGroup) {
    const n = group.get('nueva')?.value;
    const c = group.get('confirmar')?.value;
    return n === c ? null : { noCoincide: true };
  }

  // =====================================
  // GUARDAR CAMBIOS
  // =====================================
  guardar() {
    if (this.form.invalid) {
      return;
    }

    this.cargando = true;

    const { actual, nueva } = this.form.value;
    const id = this.usuarioService.currentUser()?.id;

    this.usuarioService.cambiarContrasena(id!, actual, nueva).subscribe({
      next: () => {
        this.cargando = false;

        this.snack.open('✔ Contraseña actualizada con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: 'snackbar-success',
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });

        // 🔥 FIX DEFINITIVO AQUÍ 🔥
        this.form.reset();
        Object.keys(this.form.controls).forEach((key) => {
          const control = this.form.get(key);
          control?.setErrors(null);
          control?.markAsPristine();
          control?.markAsUntouched();
        });
        this.form.updateValueAndValidity();
      },

      error: (err) => {
        this.cargando = false;
        this.snack.open('✖ Error: ' + (err.error?.message ?? 'No se pudo actualizar'), 'Cerrar', {
          duration: 3000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  cancelar() {
    this.form.reset();
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });
    this.form.updateValueAndValidity();
  }
}

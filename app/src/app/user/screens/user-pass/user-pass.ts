import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from '../../../share/services/usuario.service';
import { AuthenticationService } from '../../../share/authentication.service';

@Component({
  selector: 'app-user-pass',
  templateUrl: './user-pass.html',
  standalone: false,
  styleUrls: ['./user-pass.scss'],
})
export class UserPass implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private auth: AuthenticationService,
    private dialogRef: MatDialogRef<UserPass>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      actual: ['', Validators.required],
      nueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', Validators.required],
    });
  }

  contraseniasCoinciden(): boolean {
    return this.form.value.nueva === this.form.value.confirmar;
  }

  guardar() {
    if (this.form.invalid || !this.contraseniasCoinciden()) return;

    const user = this.auth.currentUserSignal();
    if (!user) {
      alert('Error: usuario no autenticado.');
      return;
    }

    this.usuarioService
      .cambiarContrasena(user.id!, this.form.value.actual!, this.form.value.nueva!)
      .subscribe({
        next: () => {
          alert('Contraseña actualizada correctamente.');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Error al cambiar la contraseña');
        },
      });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}

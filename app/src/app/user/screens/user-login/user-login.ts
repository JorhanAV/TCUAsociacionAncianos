import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../../share/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../../share/notification-service';

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.html',
  styleUrls: ['./user-login.scss'],
})
export class UserLogin {
  form!: FormGroup;
  passwordVisible = false;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private noti: NotificationService
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', Validators.required],
    });
  }

  // ===========================
  //         LOGIN
  // ===========================
  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;

    const payload = {
      correo: this.form.value.correo,
      contraseña: this.form.value.contrasenia,
    };

    this.auth.loginUser(payload).subscribe({
      next: () => {
        this.cargando = false;

        this.mostrarToastExito('✔ Inicio de sesión exitoso');
        this.router.navigate(['/inicio']);
      },
      error: () => {
        this.cargando = false;

        this.mostrarToastError('✘ Credenciales incorrectas');
      },
    });
  }

  // ===========================
  //   Mostrar / Ocultar pass
  // ===========================
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // ===========================
  //       TOAST EXITO
  // ===========================
  private mostrarToastExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });
  }

  // ===========================
  //         TOAST ERROR
  // ===========================
  private mostrarToastError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
  }
}

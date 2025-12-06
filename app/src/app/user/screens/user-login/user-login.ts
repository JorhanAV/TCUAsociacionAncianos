import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../../share/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.html',
  styleUrls: ['./user-login.scss'],
})
export class UserLogin {
  form!: FormGroup; // <- se declara aquí, sin inicializar

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private router: Router
  ) {
    // aquí SI se puede usar fb, ya está inicializado por Angular
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) return;

    const payload = {
      correo: this.form.value.correo,
      contraseña: this.form.value.contrasenia, // 👈 mapear correctamente
    };

    this.auth.loginUser(payload).subscribe({
      next: () => {
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error login:', err);
        alert('Credenciales incorrectas');
      },
    });
  }
}

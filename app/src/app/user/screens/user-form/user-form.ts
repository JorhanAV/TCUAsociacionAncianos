import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioModel } from '../../../share/models/usuarioModel';
import { UsuarioService } from '../../../share/services/usuario.service';
import { AuthenticationService } from '../../../share/authentication.service';
@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss'],
})
export class UserForm implements OnInit {

  @Input() usuario: UsuarioModel | null = null;
  @Input() modo: 'crear' | 'editar' = 'crear';

  @Output() cerrar = new EventEmitter<boolean>();

  roles = ['Admin', 'Socio', 'Voluntario'];

  form: any; // se inicializa en ngOnInit

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authUser: AuthenticationService
  ) {}

  ngOnInit() {
    // Crear formulario AQUÍ (fb ya está inicializado)
    this.form = this.fb.group({
      nombre_usuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['Socio', Validators.required],
      contrasenia: [''],
    });

    // Si es edición, cargar valores
    if (this.modo === 'editar' && this.usuario) {
      this.form.patchValue({
        nombre_usuario: this.usuario.nombre_usuario,
        correo: this.usuario.correo,
        rol: this.usuario.rol
      });
    } else {
      // Contraseña obligatoria en crear
      this.form.get('contrasenia')?.addValidators([Validators.required]);
    }
  }

  guardar() {
    if (this.form.invalid) return;

    const payload: any = {
      nombre_usuario: this.form.value.nombre_usuario!,
      correo: this.form.value.correo!,
      rol: this.form.value.rol!,
    };

    if (this.modo === 'crear') {
      payload.contrasenia = this.form.value.contrasenia!;
      this.authUser.createUser(payload).subscribe({
        next: () => this.cerrar.emit(true),
        error: (err) => console.error(err),
      });
    } else {
      this.usuarioService.update({
        ...this.usuario!,
        ...payload,
      }).subscribe({
        next: () => this.cerrar.emit(true),
        error: (err) => console.error(err),
      });
    }
  }
}

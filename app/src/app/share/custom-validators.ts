import { AbstractControl } from '@angular/forms';
import { UsuarioService } from './services/usuario.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export function passwordStrengthValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  return valid ? null : { weakPassword: true };
}

export function customEmailValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (!value) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(value) ? null : { invalidEmail: true };
}

export function emailExistsValidator(usuarioService: UsuarioService) {
  return (control: AbstractControl): Observable<{ emailExists: true } | null> => {
    const correo = control.value;
    if (!correo) return of(null);

    return usuarioService.verificarCorreo(correo).pipe(
      map((existe: boolean) => (existe ? { emailExists: true } : null))
    );
  };
}

export function emailExistsValidatorUpdate(usuarioService: UsuarioService, idUsuario: number) {
  return (control: AbstractControl): Observable<{ emailExists: true } | null> => {
    const correo = control.value;
    if (!correo) return of(null);

    return usuarioService.verificarCorreoUpdate(correo).pipe(
      map((idEncontrado: number | null) => {
        // Si el correo existe y pertenece a otro usuario, es error
        return idEncontrado !== null && idEncontrado !== idUsuario
          ? { emailExists: true }
          : null;
      })
    );
  };
}

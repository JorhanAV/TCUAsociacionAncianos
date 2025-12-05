import { inject, Injectable } from '@angular/core';

import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../models/usuarioModel';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends BaseAPI<UsuarioModel> {
  private authService = inject(AuthenticationService);
  currentUser = this.authService.currentUserSignal;

  constructor(httpClient: HttpClient) {
    super(httpClient, environment.endPointUsuario);
  }

  cambiarContrasena(id: number, actual: string, nueva: string) {
    return this.http.put(`${environment.apiURL}/usuario/${id}/password`, {
      actual,
      nueva,
    });
  }

  verificarCorreo(correo: string) {
    return this.http.get<boolean>(
      `${environment.apiURL}/usuario/verificar-correo?correo=${correo}`
    );
  }

  verificarCorreoUpdate(correo: string): Observable<number | null> {
  return this.http.get<number | null>(`${environment.apiURL}/usuario/verificar-correo?correo=${correo}`);
}


  correoPerteneceAOtroUsuario(correo: string, id: number): boolean {
    // Este método puede ser simulado en frontend si tenés el usuario actual cargado
    // O puede ser parte del backend si querés hacerlo más seguro

    if (
      this.currentUser()?.correo === correo &&
      this.currentUser()?.id === id
    ) {
      return false; // Simulación: asumimos que el correo pertenece al mismo usuario
    } else {
      return true; // Simulación: asumimos que el correo pertenece a otro usuario
    }
  }
}

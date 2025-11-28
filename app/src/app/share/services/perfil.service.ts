import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseAPI } from '../base-api';
import { perfilModel, ERol, EEstado, ActividadPerfilModel } from '../models/perfilModel';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PerfilService extends BaseAPI<perfilModel> {
  constructor(http: HttpClient) {
    // endpoint = 'perfiles' (o environment.endPointPerfil si lo tienes)
    super(http, environment.endPointPerfiles ?? 'perfiles');
  }
  saveWithPhoto(
    data: FormData,
    modo: 'crear' | 'editar',
    idPerfil: number | undefined
  ): Observable<perfilModel> {
    if (modo === 'crear') {
      // POST para crear
      return this.http.post<perfilModel>(`${this.urlAPI}/${this.endpoint}`, data);
    } else if (modo === 'editar' && idPerfil) {
      // PUT para actualizar
      return this.http.put<perfilModel>(`${this.urlAPI}/${this.endpoint}/${idPerfil}`, data);
    }
    throw new Error('Modo o ID de perfil inválido para la operación de guardado.');
  }
  /**
   * Listado con filtros/paginación:
   * GET /api/perfiles?pagina=&limite=&rol=&estado=&q=
   */
  listPaged(options?: {
    pagina?: number;
    limite?: number;
    rol?: ERol | '';
    estado?: EEstado | '';
    q?: string;
  }): Observable<{
    pagina: number;
    limite: number;
    total: number;
    paginas: number;
    items: perfilModel[];
  }> {
    let params = new HttpParams();

    if (options?.pagina !== undefined) {
      params = params.set('pagina', options.pagina);
    }
    if (options?.limite !== undefined) {
      params = params.set('limite', options.limite);
    }
    if (options?.rol !== undefined && options.rol !== '') {
      params = params.set('rol', options.rol);
    }
    if (options?.estado !== undefined && options.estado !== '') {
      params = params.set('estado', options.estado);
    }
    if (options?.q) {
      params = params.set('q', options.q);
    }

    return this.http.get<{
      pagina: number;
      limite: number;
      total: number;
      paginas: number;
      items: perfilModel[];
    }>(`${this.urlAPI}/${this.endpoint}`, { params });
  }

  /**
   * Cambiar estado (ACTIVO / INACTIVO)
   * PATCH /api/perfiles/:id/estado
   */
  setEstado(id: number, estado: EEstado): Observable<perfilModel> {
    return this.http.patch<perfilModel>(`${this.urlAPI}/${this.endpoint}/${id}/estado`, { estado });
  }

  // ---------- Actividades <-> Perfil ----------

  /**
   * Obtener actividades asociadas a un perfil
   * GET /api/perfiles/:id/actividades
   */
  getActividades(idPerfil: number): Observable<ActividadPerfilModel[]> {
    return this.http.get<ActividadPerfilModel[]>(
      `${this.urlAPI}/${this.endpoint}/${idPerfil}/actividades`
    );
  }

  /**
   * Vincular una actividad a un perfil
   * POST /api/perfiles/:id/actividades  { idActividad }
   */
  vincularActividad(idPerfil: number, idActividad: number): Observable<any> {
    return this.http.post(`${this.urlAPI}/${this.endpoint}/${idPerfil}/actividades`, {
      idActividad,
    });
  }

  /**
   * Desvincular una actividad de un perfil
   * DELETE /api/perfiles/:id/actividades/:idActividad
   */
  desvincularActividad(idPerfil: number, idActividad: number): Observable<any> {
    return this.http.delete(
      `${this.urlAPI}/${this.endpoint}/${idPerfil}/actividades/${idActividad}`
    );
  }
}

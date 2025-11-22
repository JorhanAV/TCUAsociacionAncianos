import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BaseAPI } from '../base-api';
import { ActividadModel } from '../models/actividadModel';

@Injectable({
  providedIn: 'root',
})
export class ActividadService extends BaseAPI<ActividadModel> {
  constructor(httpCliente: HttpClient) {
    super(httpCliente,environment.endPointActividades);
  }
}

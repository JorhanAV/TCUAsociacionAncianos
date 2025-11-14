import { Injectable } from '@angular/core';
import { BaseAPI } from '../base-api';
import { HistorialInventarioModel } from '../models/historialInventarioModel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class HistorialInventarioService extends BaseAPI<HistorialInventarioModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.endPointHistInventario);
  }
}

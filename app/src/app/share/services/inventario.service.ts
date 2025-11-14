import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BaseAPI } from '../base-api';
import { InventarioModel } from '../models/inventarioModel';

@Injectable({
  providedIn: 'root',
})
export class InventarioService extends BaseAPI<InventarioModel> {
  constructor(httpCliente: HttpClient) {
    super(httpCliente,environment.endPointInventario);
  }
}

// src/app/share/services/image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { perfilModel } from '../models/perfilModel';

export interface PerfilFotoResponse {
  message: string;
  fileName: string;
  perfil: perfilModel;
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private baseUrl = `${environment.apiURL}/imagenes`; // ajusta según tu backend

  constructor(private http: HttpClient) {}

   uploadPerfilFoto(file: File, previousFileName?: string | null): Observable<any[]> {
    const formData = new FormData();

    // este nombre de campo lo espera tu middleware ImageConfig
    formData.append('imagenes', file);

    // para que ImageConfig pueda borrar la anterior
    if (previousFileName) {
      formData.append('previousFileName', previousFileName);
    }

    // POST http://localhost:3000/imagenes/upload
    return this.http.post<any[]>(`${this.baseUrl}/upload`, formData);
  }
}

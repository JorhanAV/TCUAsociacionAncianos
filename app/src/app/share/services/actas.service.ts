import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface ActaModel {
  id: number;
  URL: string;
  idUsuario: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActasService {

  private baseUrl = `${environment.apiURL}/actas`;
  private fileBaseUrl = `${environment.actasBaseUrl}`;

  constructor(private http: HttpClient) {}

  uploadActa(file: File, idUsuario: number): Observable<ActaModel> {
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("idUsuario", idUsuario.toString());

    return this.http.post<ActaModel>(this.baseUrl, formData);
  }

  getAll(): Observable<ActaModel[]> {
    return this.http.get<ActaModel[]>(this.baseUrl);
  }

  getById(id: number): Observable<ActaModel> {
    return this.http.get<ActaModel>(`${this.baseUrl}/${id}`);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Similar a getFotoUrl()
  getActaUrl(fileName: string): string {
    return this.fileBaseUrl + fileName;
  }
}

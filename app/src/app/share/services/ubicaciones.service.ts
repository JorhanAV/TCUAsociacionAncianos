import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UbicacionesService {
  private base = 'https://ubicaciones.paginasweb.cr';

  constructor(private http: HttpClient) {}

  provincias() {
    return this.http.get(`${this.base}/provincias.json`).pipe(
      map((res: any) =>
        Object.entries(res).map(([codigo, nombre]) => ({ codigo, nombre }))
      )
    );
  }

  cantones(idProvincia: string) {
    return this.http.get(`${this.base}/provincia/${idProvincia}/cantones.json`).pipe(
      map((res: any) =>
        Object.entries(res).map(([codigo, nombre]) => ({ codigo, nombre }))
      )
    );
  }

  distritos(idProvincia: string, idCanton: string) {
  return this.http.get(
    `${this.base}/provincia/${idProvincia}/canton/${idCanton}/distritos.json`
  ).pipe(
    map((res: any) =>
      Object.entries(res).map(([codigo, nombre]) => ({ codigo, nombre }))
    )
  );
}

}
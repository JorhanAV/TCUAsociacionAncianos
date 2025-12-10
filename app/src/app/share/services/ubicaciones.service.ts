import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

// 🚨 Importa directamente el JSON. Asegúrate que la ruta sea correcta.
// En algunas configuraciones de Angular, el default es necesario.
import * as ubicacionesJson from '../../../assets/ubicaciones-cr.json';

// --- Interfaces para un mejor tipado (Opcional, pero recomendado) ---
interface Ubicacion {
  codigo: string;
  nombre: string;
}

interface Distrito extends Ubicacion {}

interface Canton extends Ubicacion {
  distritos: Distrito[];
}

interface Provincia extends Ubicacion {
  cantones: Canton[];
}
// -------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class UbicacionesService {
  // El JSON importado es el array principal de Provincias
  // Manejamos la estructura del JSON importado si viene en 'default' o directo
  private readonly data: Provincia[] = (ubicacionesJson as any).default || ubicacionesJson;

  constructor() {
    if (this.data.length === 0) {
      console.error('ERROR: El JSON de ubicaciones no se cargó correctamente o está vacío.');
    }
  }

  /**
   * Retorna todas las provincias.
   */
  provincias(): Observable<Ubicacion[]> {
    const provinciasSimples = this.data.map((p) => ({
      codigo: p.codigo,
      nombre: p.nombre,
    }));
    return of(provinciasSimples);
  }

  /**
   * Retorna los cantones de la provincia dada.
   */
  cantones(idProvincia: string): Observable<Ubicacion[]> {
    if (!idProvincia) return of([]);
    
    const provincia = this.data.find((p) => p.codigo === idProvincia);
    if (!provincia) {
      // Opcional: lanzar error si el código es inválido
      // return throwError(() => new Error(`Provincia con código ${idProvincia} no encontrada.`));
      return of([]);
    }
    
    const cantonesSimples = provincia.cantones.map((c) => ({
      codigo: c.codigo,
      nombre: c.nombre,
    }));
    return of(cantonesSimples);
  }

  /**
   * Retorna los distritos del cantón y provincia dados.
   */
  distritos(idProvincia: string, idCanton: string): Observable<Ubicacion[]> {
    if (!idProvincia || !idCanton) return of([]);

    const provincia = this.data.find((p) => p.codigo === idProvincia);
    if (!provincia) {
      return of([]);
    }
    
    const canton = provincia.cantones.find((c) => c.codigo === idCanton);
    if (!canton) {
      return of([]);
    }
    
    const distritosSimples = canton.distritos.map((d) => ({
      codigo: d.codigo,
      nombre: d.nombre,
    }));
    return of(distritosSimples);
  }
}
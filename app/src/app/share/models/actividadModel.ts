import { ActividadPerfilModel } from "./actividadPerfilModel";
import { InventarioActividadModel } from "./inventarioActividadModel";
import { ETipoActividad } from "./tipoActividadModel";

export interface ActividadModel {
  id?: number;
  nombre: string;
  fechaActividad: string | Date;
  horaInicio: string | Date;
  duracion: number;
  tipoActividad: ETipoActividad;

  // Relaciones
  perfiles?: ActividadPerfilModel[];
  inventarios?: InventarioActividadModel[];

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
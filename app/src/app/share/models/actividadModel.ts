import { ActividadPerfil } from "./actividadPerfilModel";
import { InventarioActividad } from "./inventarioActividadModel";
import { ETipoActividad } from "./tipoActividadModel";

export interface Actividad {
  id?: number;
  nombre: string;
  fechaActividad: string | Date;
  horaInicio: string | Date;
  duracion: number;
  tipoActividad: ETipoActividad;

  // Relaciones
  perfiles?: ActividadPerfil[];
  inventarios?: InventarioActividad[];

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
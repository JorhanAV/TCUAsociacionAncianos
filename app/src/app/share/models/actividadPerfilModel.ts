import { Actividad } from "./actividadModel";
import { Perfil } from "./perfilModel";

export interface ActividadPerfil {
  id?: number;
  idPerfil: number;
  idActividad: number;

  perfil?: Perfil;
  actividad?: Actividad;
}
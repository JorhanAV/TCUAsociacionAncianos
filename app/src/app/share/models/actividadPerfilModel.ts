import { ActividadModel } from "./actividadModel";
import { PerfilModel } from "./PerfilModel";

export interface ActividadPerfilModel {
  id?: number;
  idPerfil: number;
  idActividad: number;

  perfil?: PerfilModel;
  actividad?: ActividadModel;
}
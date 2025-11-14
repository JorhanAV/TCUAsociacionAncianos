import { ActividadModel } from "./actividadModel";
import { PerfilModel } from "./perfilModel";

export interface ActividadPerfilModel {
  id?: number;
  idPerfil: number;
  idActividad: number;

  perfil?: PerfilModel;
  actividad?: ActividadModel;
}
import { ActividadModel } from "./actividadModel";
import { perfilModel } from "./perfilModel";

export interface ActividadPerfilModel {
  id?: number;
  idPerfil: number;
  idActividad: number;

  perfil?: perfilModel;
  actividad?: ActividadModel;
}
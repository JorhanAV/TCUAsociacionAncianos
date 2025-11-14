import { ActaModel } from "./actaModel";
import { PerfilModel } from "./perfilModel";

export interface ActaPerfilModel {
  id?: number;
  idActa: number;
  idPerfiles: number;

  acta?: ActaModel;
  perfil?: PerfilModel;
}
import { ActaModel } from "./actaModel";
import { PerfilModel } from "./PerfilModel";

export interface ActaPerfilModel {
  id?: number;
  idActa: number;
  idPerfiles: number;

  acta?: ActaModel;
  perfil?: PerfilModel;
}
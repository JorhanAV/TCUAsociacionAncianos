import { ActaModel } from "./actaModel";
import { perfilModel } from "./perfilModel";

export interface ActaPerfilModel {
  id?: number;
  idActa: number;
  idPerfiles: number;

  acta?: ActaModel;
  perfil?: perfilModel;
}
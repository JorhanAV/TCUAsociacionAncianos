import { Acta } from "./actaModel";
import { Perfil } from "./perfilModel";

export interface ActaPerfil {
  id?: number;
  idActa: number;
  idPerfiles: number;

  acta?: Acta;
  perfil?: Perfil;
}
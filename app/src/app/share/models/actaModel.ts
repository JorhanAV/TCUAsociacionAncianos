import { ActaPerfilModel } from "./actaPerfilModel";
import { UsuarioModel } from "./usuarioModel";

export interface ActaModel {
  id?: number;
  URL: string;
  idUsuario: number;
  fecha: string | Date;

  // Relaciones
  usuario?: UsuarioModel;
  perfiles?: ActaPerfilModel[];
}
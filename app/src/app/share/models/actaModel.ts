import { ActaPerfil } from "./actaPerfilModel";
import { Usuario } from "./usuarioModel";

export interface Acta {
  id?: number;
  URL: string;
  idUsuario: number;
  fecha: string | Date;

  // Relaciones
  usuario?: Usuario;
  perfiles?: ActaPerfil[];
}
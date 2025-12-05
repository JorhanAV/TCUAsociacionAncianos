import { ActaModel } from "./actaModel";
import { HistorialInventarioModel } from "./historialInventarioModel";

export interface UsuarioModel {
  id?: number;
  nombre_usuario: string;
  correo: string;
  contrasenia?: string;
  ultimo_inicio_sesion?: string | Date;
  rol: string;
  // Relaciones
  historialInventario?: HistorialInventarioModel[];
  actas?: ActaModel[];
}
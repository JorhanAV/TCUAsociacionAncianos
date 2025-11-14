import { Acta } from "./actaModel";
import { HistorialInventario } from "./historialInventarioModel";

export interface Usuario {
  id?: number;
  nombre_usuario: string;
  correo: string;
  contrasenia?: string;
  ultimo_inicio_sesion?: string | Date;

  // Relaciones
  historialInventario?: HistorialInventario[];
  actas?: Acta[];
}
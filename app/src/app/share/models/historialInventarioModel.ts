import { Inventario } from "./inventarioModel";
import { EMovimientoInventario } from "./movimientoInventarioModel";
import { Usuario } from "./usuarioModel";

export interface HistorialInventario {
  id?: number;
  idInventario: number;
  idUsuario: number;
  fecha: string | Date;
  descripcion?: string;
  tipoMovimiento: EMovimientoInventario;

  // Relaciones
  inventario?: Inventario;
  usuario?: Usuario;
}
import { InventarioModel } from "./inventarioModel";
import { EMovimientoInventario } from "./movimientoInventarioModel";
import { UsuarioModel } from "./usuarioModel";

export interface HistorialInventarioModel {
  id?: number;
  idInventario: number;
  idUsuario: number;
  fecha: string | Date;
  descripcion?: string;
  tipoMovimiento: EMovimientoInventario;

  // Relaciones
  inventario?: InventarioModel;
  usuario?: UsuarioModel;
}
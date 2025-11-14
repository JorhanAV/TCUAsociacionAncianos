import { ECategoria } from "./categoriaModel";
import { EEstado } from "./estadoModel";
import { HistorialInventarioModel } from "./historialInventarioModel";
import { InventarioActividadModel } from "./inventarioActividadModel";

export interface InventarioModel {
  id?: number;
  idCategoria: ECategoria;
  Nombre: string;
  descripcion?: string;
  stock: number;
  estado: EEstado;

  // Relaciones
  historial?: HistorialInventarioModel[];
  actividades?: InventarioActividadModel[];

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
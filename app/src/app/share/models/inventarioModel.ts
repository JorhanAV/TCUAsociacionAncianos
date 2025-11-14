import { ECategoria } from "./categoriaModel";
import { EEstado } from "./estadoModel";
import { HistorialInventarioModel } from "./historialInventarioModel";
import { inventarioActividadModel } from "./inventarioActividadModel";

export interface InventarioModel {
  id?: number;
  idCategoria: ECategoria;
  nombre: string;
  descripcion?: string;
  stock: number;
  estado: EEstado;

  // Relaciones
  historial?: HistorialInventarioModel[];
  actividades?: inventarioActividadModel[];

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
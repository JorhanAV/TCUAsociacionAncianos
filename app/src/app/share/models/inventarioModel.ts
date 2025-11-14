import { ECategoria } from "./CategoriaModel";
import { EEstado } from "./estadoModel";
import { HistorialInventario } from "./historialInventarioModel";
import { InventarioActividad } from "./inventarioActividadModel";

export interface Inventario {
  id?: number;
  idCategoria: ECategoria;
  Nombre: string;
  descripcion?: string;
  stock: number;
  estado: EEstado;

  // Relaciones
  historial?: HistorialInventario[];
  actividades?: InventarioActividad[];

  createdAt?: string | Date;
  updatedAt?: string | Date;
}
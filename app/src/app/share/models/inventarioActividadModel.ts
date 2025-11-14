import { Actividad } from "./actividadModel";
import { Inventario } from "./inventarioModel";

export interface InventarioActividad {
  id?: number;
  idInventario: number;
  idActividad: number;

  inventario?: Inventario;
  actividad?: Actividad;
}

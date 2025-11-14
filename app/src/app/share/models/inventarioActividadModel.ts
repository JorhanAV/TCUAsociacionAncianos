import { ActividadModel } from "./actividadModel";
import { InventarioModel } from "./inventarioModel";

export interface InventarioActividadModel {
  id?: number;
  idInventario: number;
  idActividad: number;

  inventario?: InventarioModel;
  actividad?: ActividadModel;
}

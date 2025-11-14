import { ActaPerfilModel } from "./actaPerfilModel";
import { ActividadPerfilModel } from "./actividadPerfilModel";
import { EEstado } from "./estadoModel";
import { ERol } from "./rolModel";

export interface PerfilModel {
  id?: number;
  nombre: string;
  fechaNacimiento: string | Date;
  cedula: string;
  rol: ERol;
  fotoURL?: string;
  telefonoContacto?: string;
  numeroCelular?: string;
  direccion?: string;
  estado: EEstado;

  // Relaciones
  actividades?: ActividadPerfilModel[];
  actas?: ActaPerfilModel[];
}
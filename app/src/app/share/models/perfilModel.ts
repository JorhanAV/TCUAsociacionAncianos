import { ActaPerfil } from "./actaPerfilModel";
import { ActividadPerfil } from "./actividadPerfilModel";
import { EEstado } from "./estadoModel";
import { ERol } from "./rolModel";

export interface Perfil {
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
  actividades?: ActividadPerfil[];
  actas?: ActaPerfil[];
}
// Enums del backend
export enum ERol {
  Admin = 'Admin',
  Adulto = 'Adulto',
  Voluntario = 'Voluntario',
  Socio = 'Socio',
}

export enum EEstado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export enum ETipoActividad {
  Pintar = 'Pintar',
  Cognitivo = 'Cognitivo',
  Baile = 'Baile',
  Quiting = 'Quiting',
  Generales = 'Generales',
}

// Modelos mínimos para actividades vinculadas
export interface ActividadLiteModel {
  id: number;
  nombre: string;
  fechaActividad: string; // ISO
  horaInicio: string;     // ISO
  duracion: number;       // minutos
  tipoActividad: ETipoActividad;
}

export interface ActividadPerfilModel {
  id: number;
  idPerfil: number;
  idActividad: number;
  actividad: ActividadLiteModel;
}

// Perfil principal (match con selects del controller)
export interface PerfilModel {
  id: number;
  nombre: string;
  fechaNacimiento: string; // ISO
  cedula: string;
  rol: ERol;
  fotoURL?: string | null;
  telefonoContacto?: string | null;
  numeroCelular?: string | null;
  direccion?: string | null;
  estado: EEstado;

  // Para vistas donde quieras mostrar relaciones contadas o listas:
  _count?: { actividades: number; actas: number };
  actividades?: ActividadPerfilModel[]; // cuando se cargan vía /:id/actividades o include
}

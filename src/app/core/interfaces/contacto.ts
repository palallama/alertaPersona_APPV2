export interface ContactoUsuario {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  telefono?: string;
}

export interface Contacto {
  id: number;
  usuarioId: number;
  contactoId: number;
  activo: boolean;
  eliminado?: boolean;
  estado: EstadoContacto;
  fchCreacion: Date;
  fchActualizacion?: Date;
  fchEliminacion?: Date;
  fchRespuesta?: Date;

  usuario?: ContactoUsuario;
  contactoUsuario?: ContactoUsuario;
}

export interface ContactoCompleto {
  id: number;
  usuarioId: number;
  contactoId: number;
  activo: boolean;
  eliminado: boolean;
  fchCreacion: Date; // Convertido a Date para uso en la UI
  fchActualizacion: Date; // Convertido a Date para uso en la UI
  fchEliminacion: Date | null; // Convertido a Date para uso en la UI
  nombreCompleto: string; // nombre + apellido combinados
  nombre: string;
  apellido: string;
  mail: string;
  telefono: string;
}

// Enum para estados si se necesita en el futuro
export enum EstadoContacto {
  PENDIENTE = 'P',
  ACEPTADA = 'A', 
  RECHAZADA = 'R'
}
export function getEstadoDescripcion(estado: EstadoContacto): string {
  switch (estado) {
    case EstadoContacto.PENDIENTE:
      return 'Pendiente';
    case EstadoContacto.ACEPTADA:
      return 'Aceptada';
    case EstadoContacto.RECHAZADA:
      return 'Rechazada';
    default:
      return 'Desconocido';
  }
}
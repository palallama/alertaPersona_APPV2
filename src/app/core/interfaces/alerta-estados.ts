
export enum AlertaEstados {
  EMITIDA = 'E',
  CANCELADA = 'C',
  SOLUCIONADA = 'S',
  EXPIRADA = 'X',
}

export const getEstadoDescripcion = (estado: AlertaEstados): string => {
  switch (estado) {
    case AlertaEstados.EMITIDA:
      return 'Alerta emitida';
    case AlertaEstados.CANCELADA:
      return 'Alerta cancelada';
    case AlertaEstados.SOLUCIONADA:
      return 'Alerta solucionada';
    case AlertaEstados.EXPIRADA:
      return 'Alerta expirada';
    default:
      return 'Estado desconocido';
  }
};

export const getEstadoIcon = (estado: AlertaEstados): string => {
  switch (estado) {
    case AlertaEstados.EMITIDA:
      return 'sync-outline';
    case AlertaEstados.CANCELADA:
      return 'close-circle';
    case AlertaEstados.SOLUCIONADA:
      return 'checkmark-circle';
    case AlertaEstados.EXPIRADA:
      return 'time';
    default:
      return 'help-circle';
  }
};
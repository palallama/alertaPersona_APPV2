export interface PreferenciaConfig {
  clave: string;
  nombre: string;
  descripcion: string;
  icono: string;
  categoria: 'notificaciones' | 'privacidad' | 'seguridad';
}

export const PREFERENCIAS_CONFIG: PreferenciaConfig[] = [
  {
    clave: 'EMAIL',
    nombre: 'Notificaciones por Email',
    descripcion: 'Recibir alertas y notificaciones por correo electrónico',
    icono: 'mail-outline',
    categoria: 'notificaciones'
  },
  {
    clave: 'NOTIFICACION',
    nombre: 'Notificaciones Push',
    descripcion: 'Recibir notificaciones push en tu dispositivo',
    icono: 'notifications-outline',
    categoria: 'notificaciones'
  }
];

export function obtenerConfigPreferencia(clave: string): PreferenciaConfig | undefined {
  return PREFERENCIAS_CONFIG.find(config => config.clave === clave);
}

export function obtenerPreferenciasPorCategoria(categoria: 'notificaciones' | 'privacidad' | 'seguridad'): PreferenciaConfig[] {
  return PREFERENCIAS_CONFIG.filter(config => config.categoria === categoria);
}

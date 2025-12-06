import { Alerta } from './alerta';

export interface AlertaContacto extends Alerta {
  // Propiedades adicionales si las necesitas
}

export interface AlertasContactoResponse {
  alerts: Alerta[];
  count: number;
}

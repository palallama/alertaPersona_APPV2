import { styleMap } from './map-style';

export interface GoogleMapConfig {
  scrollwheel?: boolean;
  zoomControl?: boolean;
  disableDoubleClickZoom?: boolean;
  disableDefaultUI?: boolean;
  fullscreenControl?: boolean;
  mapTypeControl?: boolean;
  streetViewControl?: boolean;
  rotateControl?: boolean;
  scaleControl?: boolean;
  gestureHandling?: 'auto' | 'cooperative' | 'greedy' | 'none';
  styles?: any[];
}

export const DEFAULT_MAP_CONFIG: GoogleMapConfig = {
  scrollwheel: true,
  zoomControl: false,
  disableDoubleClickZoom: true,
  disableDefaultUI: true,
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  rotateControl: false,
  scaleControl: false,
  gestureHandling: 'auto',
  styles: styleMap,
};

export const MINIMAL_MAP_CONFIG: GoogleMapConfig = {
  scrollwheel: false,
  zoomControl: false,
  disableDoubleClickZoom: true,
  disableDefaultUI: true,
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  rotateControl: false,
  scaleControl: false,
  gestureHandling: 'none',
  styles: styleMap,
};

export const FULL_FEATURED_MAP_CONFIG: GoogleMapConfig = {
  scrollwheel: true,
  zoomControl: true,
  disableDoubleClickZoom: false,
  disableDefaultUI: false,
  fullscreenControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  rotateControl: true,
  scaleControl: true,
  gestureHandling: 'auto',
  styles: styleMap,
};

/**
 * Obtiene una configuración personalizada combinando la base con overrides
 */
export function getCustomMapConfig(overrides: Partial<GoogleMapConfig> = {}): GoogleMapConfig {
  return { ...DEFAULT_MAP_CONFIG, ...overrides };
}

/**
 * Configuración sin estilos (mapa estándar de Google)
 */
export function getStandardMapConfig(): GoogleMapConfig {
  return { ...DEFAULT_MAP_CONFIG, styles: undefined };
}

/**
 * Configuración para modo oscuro (si se implementa)
 */
export function getDarkModeMapConfig(): GoogleMapConfig {
  // Aquí se podrían agregar estilos específicos para modo oscuro
  return { ...DEFAULT_MAP_CONFIG, styles: styleMap };
}
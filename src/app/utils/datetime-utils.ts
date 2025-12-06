// Convierte una fecha/hora en formato ISO (UTC) a string HH:mm ajustado a la zona horaria indicada
export function formatTime(value: any, offset: number = 0): string {
  if (typeof value === 'string') {
    // Si es formato ISO tipo "1970-01-01T13:00:00.000Z"
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      // Ajustar la hora por la zona
      date.setHours(date.getHours() + offset);
      return date.toTimeString().slice(0, 5);
    }
    // Si ya está en formato HH:mm
    if (/^\d{2}:\d{2}$/.test(value)) return value;
    // Si es string tipo "08:00:00", lo recortamos
    if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value.slice(0, 5);
  }
  if (typeof value === 'number') {
    // Si es número, lo interpretamos como minutos desde medianoche
    const hours = Math.floor(value / 60) + offset;
    const minutes = value % 60;
    return `${((hours + 24) % 24).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  if (value instanceof Date) {
    value.setHours(value.getHours() + offset);
    return value.toTimeString().slice(0, 5);
  }
  return '';
}

export function getTimeAgo(fecha: Date): string {
    if (!fecha) return '';
    const now = new Date();
    const diffMs = now.getTime() - fecha.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `hace ${diffSec} segundos`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `hace ${diffMin} minutos`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `hace ${diffHrs} horas`;
    const diffDays = Math.floor(diffHrs / 24);
    return `hace ${diffDays} días`;
}

// Formato corto para tiempo transcurrido (ej: "5m", "2h", "3d")
export function getTimeElapsed(timestamp: Date): string {
  const ahora = new Date();
  const fecha = new Date(timestamp);
  const diffMs = ahora.getTime() - fecha.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `${diffMins} min`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}

export function getFechaLocal(fecha: string | Date): Date {
  // Si la fecha es string en formato ISO, conviértela a Date y ajusta la zona
  const d = new Date(fecha);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function parseIsoAsLocal(iso?: string | Date | null): Date {
  if (!iso) return new Date();
  if (iso instanceof Date) return iso;
  const s = String(iso).replace(/Z|([+-]\d{2}:\d{2})$/,'');
  const [datePart, timePart='00:00:00.000'] = s.split('T');
  const [y, m, d] = datePart.split('-').map(n => parseInt(n,10));
  const [timeMain, msPart='0'] = timePart.split('.');
  const [hh = '0', mm = '0', ss = '0'] = timeMain.split(':');
  const ms = parseInt((msPart+'000').slice(0,3),10);
  return new Date(y, (m||1) - 1, d || 1, parseInt(hh,10)||0, parseInt(mm,10)||0, parseInt(ss,10)||0, ms||0);
}

/**
 * Formatea el tiempo transcurrido
 */
export function getFormattedTime(elapsedTime: number): string {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


  /**
   * Convierte una fecha a formato YYYY-MM-DD para inputs de tipo date
   */
  export function formatDateForInput(dateValue: any): string {
    if (!dateValue) return '';
    
    try {
      let date: Date;
      
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        // Si ya está en formato ISO (YYYY-MM-DD), devolverlo tal como está
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
          return dateValue;
        }
        // Si es ISO datetime, extraer solo la fecha
        if (dateValue.includes('T')) {
          return dateValue.split('T')[0];
        }
        date = new Date(dateValue);
      } else {
        date = new Date(dateValue);
      }
      
      // Verificar que la fecha es válida
      if (isNaN(date.getTime())) {
        return '';
      }
      
      // Formatear a YYYY-MM-DD usando UTC para evitar problemas de timezone
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formateando fecha para input:', error);
      return '';
    }
  }

  /**
   * Convierte una fecha del input (YYYY-MM-DD) a objeto Date
   */
  export function formatDateFromInput(dateString: string): Date | null {
    if (!dateString) return null;
    
    try {
      // Crear fecha en UTC para evitar problemas de timezone
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    } catch (error) {
      console.error('Error parseando fecha:', error);
      return null;
    }
  }

  /**
   * Obtiene la fecha de nacimiento formateada para mostrar
   */
  export function fechaNacimientoDisplay(date:Date): string {
    if (!date) return '';
    
    try {
      
      if (date instanceof Date) {
        date = date;
      } else {
        // Si llegamos aquí, fchNacimiento debería ser Date según la interfaz
        // pero por si acaso manejamos como any
        const fechaValue = date as any;
        
        if (typeof fechaValue === 'string') {
          // Si es ISO datetime, crear fecha en UTC
          if (fechaValue.includes('T')) {
            date = new Date(fechaValue + (fechaValue.endsWith('Z') ? '' : 'Z'));
          } else {
            // Si es solo fecha, crear en UTC
            date = new Date(fechaValue + 'T00:00:00.000Z');
          }
        } else {
          date = new Date(fechaValue);
        }
      }
      
      // Verificar que la fecha es válida
      if (isNaN(date.getTime())) {
        return '';
      }
      
      // Usar UTC para evitar problemas de timezone
      const day = date.getUTCDate();
      const month = date.getUTCMonth();
      const year = date.getUTCFullYear();
      
      const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      
      return `${day} de ${meses[month]} de ${year}`;
    } catch (error) {
      console.error('Error formateando fecha para display:', error);
      return '';
    }
  }
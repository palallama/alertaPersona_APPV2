import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Alerta } from '../interfaces/alerta';
import { AlertasContactoResponse } from '../interfaces/alerta-contacto';

@Injectable({
  providedIn: 'root'
})
export class AlertaContactoService {
  private http = inject(HttpClient);
  private URL_COMPLETA = environment.backendUrl;

  // Signal para el conteo de alertas activas
  alertasActivasCount = signal<number>(0);
  alertasActivas = signal<Alerta[]>([]);

  /**
   * Obtiene las alertas activas de los contactos del usuario
   */
  getAlertasActivasContactos(): Observable<Alerta[]> {
    return this.http.get<AlertasContactoResponse>(`${this.URL_COMPLETA}/alerta/contactos/activas`)
      .pipe(
        map(response => {
          this.alertasActivasCount.set(response.count);
          this.alertasActivas.set(response.alerts);
          return response.alerts;
        })
      );
  }

  /**
   * Marca una alerta como vista
   */
  marcarAlertaComoVista(alertaId: number): Observable<any> {
    return this.http.post(`${this.URL_COMPLETA}/alertas/${alertaId}/vista`, {});
  }

  /**
   * Inicia el polling para actualizar las alertas cada cierto tiempo
   * @param intervalMs Intervalo en milisegundos (default: 30000 = 30 segundos)
   */
  iniciarActualizacionAutomatica(intervalMs: number = 30000): Observable<Alerta[]> {
    return interval(intervalMs).pipe(
      startWith(0), // Ejecutar inmediatamente
      switchMap(() => this.getAlertasActivasContactos())
    );
  }

  /**
   * Limpia las alertas
   */
  limpiarAlertas() {
    this.alertasActivasCount.set(0);
    this.alertasActivas.set([]);
  }
}

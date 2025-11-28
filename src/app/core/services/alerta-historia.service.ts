import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Historial } from '../interfaces/alerta';

@Injectable({
  providedIn: 'root'
})
export class AlertaHistoriaService {
  private http = inject(HttpClient);
  private URL_COMPLETA = environment.backendUrl;
  
  getHistorialUsuario(usuario:string):Observable<Historial> {
    return this.http.get<Historial>(`${this.URL_COMPLETA}/usuario/historial-alertas/${usuario}`);
  }

}
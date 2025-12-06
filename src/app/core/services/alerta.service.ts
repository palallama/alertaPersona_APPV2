import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { interval, map, Observable, switchMap, tap } from 'rxjs';
import { Alerta } from '../interfaces/alerta';
import { AlertaEstados } from '../interfaces/alerta-estados';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private http = inject(HttpClient);

  private URL_COMPLETA = environment.backendUrl;

  getAlerta(alertaId:number) : Observable<Alerta>{
    return this.http.get<Alerta>(`${this.URL_COMPLETA}/alerta/${alertaId}`);
  }

  getAlertas() : Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.URL_COMPLETA}/alerta/`);
  }

  insertAlerta(alerta:Alerta) : Observable<Alerta>{
    return this.http.post<Alerta>( `${this.URL_COMPLETA}/alerta/`, alerta);
  }

  updateAlerta(alerta:Alerta) : Observable<Alerta>  {
    return this.http.patch<Alerta>(`${this.URL_COMPLETA}/alerta/`, alerta);
  }

  deleteAlerta(alertaId:string){
    return this.http.delete(`${this.URL_COMPLETA}/alerta/${alertaId}`);
  }

  // 

  cerrarAlerta(alertaId:number, estado:AlertaEstados){
    return this.http.patch(`${this.URL_COMPLETA}/alerta/${alertaId}/cerrar`, {id: alertaId, estado: estado});
  }

}

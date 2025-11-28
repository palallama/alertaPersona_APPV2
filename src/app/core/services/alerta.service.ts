import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { interval, map, Observable, switchMap, tap } from 'rxjs';
import { Alerta } from '../interfaces/alerta';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private http = inject(HttpClient);

  private URL_COMPLETA = environment.backendUrl;

  getAlerta(alertaId:string){
    return this.http.get(`${this.URL_COMPLETA}/alerta/${alertaId}`);
  }

  getAlertas(){
    return this.http.get(`${this.URL_COMPLETA}/alerta/`);
  }

  insertAlerta(alerta:Alerta) : Observable<Alerta>{
    return this.http.post<Alerta>(`${this.URL_COMPLETA}/alerta/`, alerta);
  }

  updateAlerta(alerta:Alerta){
    return this.http.patch(`${this.URL_COMPLETA}/alerta/`, alerta);
  }

  deleteAlerta(alertaId:string){
    return this.http.delete(`${this.URL_COMPLETA}/alerta/${alertaId}`);
  }

  getAlertaPeriodica(alertaId:string, miliseg:number = 5000) {
    return interval(miliseg).pipe(
      switchMap(() => this.http.get(`${this.URL_COMPLETA}/alerta/${alertaId}`))
    )
  }

  // 

  cerrarAlerta(alertaId:any, estado:string){
    return this.http.patch(`${this.URL_COMPLETA}/alerta/${alertaId}/cerrar`, {id: alertaId, estado: estado});
  }

}

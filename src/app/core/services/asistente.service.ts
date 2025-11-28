import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Asistente } from '../interfaces/asistente';

@Injectable({
  providedIn: 'root'
})
export class AsistenteService {
  private http = inject(HttpClient);

  private URL_COMPLETA = environment.backendUrl;

  getAsistente(asistenteId:string){
    return this.http.get(`${this.URL_COMPLETA}/asistente/${asistenteId}`);
  }

  getAsistentes(){
    return this.http.get(`${this.URL_COMPLETA}/asistente/`);
  }

  insertAsistente(asistente:Asistente){
    return this.http.post(`${this.URL_COMPLETA}/asistente/`, asistente);
  }

  updateAsistente(asistente:Asistente){
    return this.http.patch(`${this.URL_COMPLETA}/asistente/`, asistente);
  }

  deleteAsistente(alertaId:number, usuarioId:number){
    return this.http.delete(`${this.URL_COMPLETA}/asistente/${alertaId}/${usuarioId}`);
  }

  getByAlertaId(alertaId:string) : Observable<Asistente[]> {
    return this.http.get<Asistente[]>(`${this.URL_COMPLETA}/asistente/alerta/${alertaId}`).pipe(
      map((asistentes: Asistente[]) => asistentes || [])
    );
  }

  getByUsuarioId(usuarioId:number) {
    return this.http.get<Asistente[]>(`${this.URL_COMPLETA}/asistente/usuario/${usuarioId}`).pipe(
      map((asistentes: Asistente[]) => asistentes || [])
    );
  }

}

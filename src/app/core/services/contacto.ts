import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private http = inject(HttpClient);
  private URL_COMPLETA = environment.backendUrl;

  getAllActive(usuarioId: string) {
    return this.http.get(`${this.URL_COMPLETA}/contacto/usuario/${usuarioId}/activos`);
  }
  getAllPending(usuarioId: string) {
    return this.http.get(`${this.URL_COMPLETA}/contacto/solicitudes-enviadas/${usuarioId}`);
  }
  getAllReceivedPending(usuarioId: string) {
    return this.http.get(`${this.URL_COMPLETA}/contacto/solicitudes-pendientes/${usuarioId}`);
  }

  // Contacto

  create(usuarioId:string, contactoId:string) {
    return this.http.post(`${this.URL_COMPLETA}/contacto/`, { usuarioId, contactoId });
  }
  delete(contactoId:string) {
    return this.http.delete(`${this.URL_COMPLETA}/contacto/${contactoId}`);
  }

  toogleActivo(contactoId:string, activo:boolean) {
    return this.http.patch(`${this.URL_COMPLETA}/contacto/${contactoId}/toggle-activo`, { activo });
  }

  responderSolicitud(contactoId:number, estado:string, usuarioId:string) {
    return this.http.patch(`${this.URL_COMPLETA}/contacto/${contactoId}/responder?usuarioId=${usuarioId}`, { estado });
  }

  cancelarSolicitud(contactoId:number, usuarioId:string) {
    return this.http.delete(`${this.URL_COMPLETA}/contacto/cancelar-solicitud/${contactoId}?usuarioId=${usuarioId}`);
  }


  // Busqueda de usuarios
  buscarUsuarios(usuarioId: string, termino: string) {
    return this.http.get(`${this.URL_COMPLETA}/contacto/buscar-usuarios/${usuarioId}?q=${termino}`);
  }

  
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario, UsuarioLogueado, UsuarioPreferencia } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private URL_COMPLETA = environment.backendUrl;

  getUsuario(usuarioId:string){
    return this.http.get(`${this.URL_COMPLETA}/usuario/${usuarioId}`);
  }

  getUsuarios(){
    return this.http.get(`${this.URL_COMPLETA}/usuario/`);
  }

  insertUsuario(usuario:Usuario){
    // return this.http.post(`${this.URL_COMPLETA}/usuario/`, usuario);
    
    return this.http.post(`${this.URL_COMPLETA}/auth/crearUsuario`, usuario);
  }

  updateUsuario(usuario:Usuario){
    return this.http.patch(`${this.URL_COMPLETA}/usuario/${usuario.id}`, usuario);
  }

  deleteUsuario(usuarioId:string){
    return this.http.delete(`${this.URL_COMPLETA}/usuario/${usuarioId}`);
  }

  activarUsuario(usuarioId:string){
    return this.http.patch(`${this.URL_COMPLETA}/usuario/${usuarioId}/activar`, {});
  }
  desactivarUsuario(usuarioId:string){
    return this.http.patch(`${this.URL_COMPLETA}/usuario/${usuarioId}/desactivar`, {});
  }

  // Gestiones

  setNotificacionToken(usuarioId:string, token:string) {
    // const aux = {
    //   id: usuarioId,
    //   token: token
    // }
    // return this.http.post(`${this.URL_COMPLETA}/usuario/${usuarioId}/setNotificacionToken`, aux);

    const aux = {
      usuarioId,
      "clave": "notiToken",
      "valor": token
    }

    return this.http.post(`${this.URL_COMPLETA}/usuario-adicional/`, aux);
  }
  getUsuarioPreferencias(usuarioId: string){
    // return this.http.get(`${this.URL_COMPLETA}/usuario/${usuarioId}/preferencias`).pipe(map( (res:any) => res.data ));
    return this.http.get(`${this.URL_COMPLETA}/usuario-preferencias/usuario/${usuarioId}`);
  }
  setDelUsuarioPreferencias(usuarioId: string, preferencia: UsuarioPreferencia){
    // return this.http.get(`${this.URL_COMPLETA}/usuario/${usuarioId}/preferencias/${preferencia.clave}`).pipe(map( (res:any) => res.data ));
    return this.http.get(`${this.URL_COMPLETA}/usuario-preferencias/usuario/${usuarioId}/clave/${preferencia.clave}/setDel`);
  }

}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { StorageKeys } from '../interfaces/storage';
import { UsuarioLogueado } from '../interfaces/usuario';
import { catchError, firstValueFrom, from, lastValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { UserStorageService } from './user-storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private userStorage = inject(UserStorageService);

  private URL_COMPLETA = environment.backendUrl;

  setAccessToken(accessToken: string) {
    this.storageService.set(StorageKeys.TOKEN, accessToken);
  }
  setRefreshToken(refreshToken: string) {
    this.storageService.set(StorageKeys.REFRESH_TOKEN, refreshToken);
  }

  clearTokens() {
    this.storageService.remove(StorageKeys.TOKEN);
    this.storageService.remove(StorageKeys.REFRESH_TOKEN);
    this.storageService.remove(StorageKeys.TOKEN_NOTIFICACION);
  }

  verifyToken(): Observable<boolean> {
    const token = this.storageService.get(StorageKeys.TOKEN);
    if (!token) return of(false);
    return this.http.get(`${this.URL_COMPLETA}/auth/profile`).pipe(
      map(() => true), // si responde 200
      catchError(() => of(false)) // si responde 401 o error
    );
  }


  iniciarSesion(mail:string, password:string) {
    // return this.http.post(`${this.URL_COMPLETA}/auth/login`, { mail: mail, password:password });//);
    return this.http.post(`${this.URL_COMPLETA}/auth/login`, { mail, password }).pipe(
      tap((res: any) => {
        this.setAccessToken(res.accessToken);
        this.setRefreshToken(res.refreshToken);
        this.userStorage.setUsuario(res.usuario);
      })
    )
  }

  cerrarSesion() {
    this.clearTokens();
    this.userStorage.clearUsuario();
    this.clearSessionData();
  }

  clearSessionData() {
    // Recorrer todos los valores de StorageKeys y borrarlos
    Object.values(StorageKeys).forEach(key => {
      this.storageService.remove(key);
    });
  }

  cambiarContrasena(nuevaContrasena:string, contrasenaActual:string) {
    return this.http.post(`${this.URL_COMPLETA}/auth/cambiar-contrasena`, { nuevaContrasena, contrasenaActual });
  }
  forgotPassword(mail:string) {
    // mail = mail.replace('@', "%40");
    return this.http.post(`${this.URL_COMPLETA}/auth/solicitar-codigo`, { email: mail });
  }
  verificarCodigoPassword(mail:string, code:string) {
    // mail = mail.replace('@', "%40");
    return this.http.post(`${this.URL_COMPLETA}/auth/verificar-codigo`, { email: mail, codigo:String(code) });
  }

  resetearContrasena(email: string, password: string) {
    return from(this.storageService.get(StorageKeys.CODIGO_RECUPERO)).pipe(
      switchMap(codigo => {
        return this.http.post(`${this.URL_COMPLETA}/auth/resetear-contrasena`, { 
          email, 
          nuevaContrasena: password, 
          codigo: String(codigo) 
        });
      })
    );
  }

  refrescarToken(): Observable<{ accessToken: string, refreshToken?: string }> {
    return from(this.storageService.get(StorageKeys.REFRESH_TOKEN)).pipe(
      switchMap(refreshToken => {
        if (!refreshToken) {
          return of({ accessToken: '' });
        }
        return this.http.post<{ access_token: string }>(`${this.URL_COMPLETA}/auth/refresh`, { refresh_token: refreshToken }).pipe(
          tap(response => {
            // El backend retorna "access_token", lo guardamos
            if (response.access_token) {
              this.setAccessToken(response.access_token);
            }
          }),
          map(response => ({
            accessToken: response.access_token || '',
            refreshToken: refreshToken // Mantener el mismo refresh token
          })),
          catchError(() => {
            // Si falla el refresh (401), limpiar tokens
            this.clearTokens();
            return of({ accessToken: '' });
          })
        );
      })
    );
  }
  
}

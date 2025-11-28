import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { StorageKeys } from '../interfaces/storage';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtenemos el token de forma asíncrona
  return from(storageService.get(StorageKeys.TOKEN)).pipe(
    switchMap(token => {
      // Solo agregamos el token si existe
      let authReq = req;
      if (token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      return next(authReq);
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.cerrarSesion();
        router.navigateByUrl('/login');
        return throwError(() => error);
      }

      // Otros errores
      return throwError(() => error);
    })
  );
};

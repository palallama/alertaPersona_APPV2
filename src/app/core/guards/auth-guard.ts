import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { catchError, map, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.verifyToken().pipe(
    switchMap((isValid) => {
      if (isValid) {
        // Token válido, permitir acceso
        return of(true);
      } else {
        // Token inválido (401), intentar refresh
        return authService.refrescarToken().pipe(
          map((response) => {
            if (response.accessToken) {
              // Refresh exitoso (200), permitir acceso
              return true;
            } else {
              // Refresh falló (401), redirigir al login
              router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
              return false;
            }
          }),
          catchError(() => {
            // Error en refresh, redirigir al login
            router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return of(false);
          })
        );
      }
    }),
    catchError(() => {
      // Error general, redirigir al login
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};

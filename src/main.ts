import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es-AR';
import { IonicStorageModule } from '@ionic/storage-angular';
import { importProvidersFrom } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { addIcons } from 'ionicons';
import { 
  close, 
  copy, 
  checkmark, 
  checkmarkCircle,
  share,
  qrCode,
  eyeOutline,
  eyeOffOutline,
  send,
  lockClosed,
  walkOutline
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/core/interceptors/auth-interceptor';
import { environment } from './environments/environment';

// Registrar el locale español de Argentina
registerLocaleData(localeEs);

// Registrar los íconos necesarios
addIcons({
  close,
  copy,
  checkmark,
  'checkmark-circle': checkmarkCircle,
  share,
  'qr-code': qrCode,
  'eye-outline': eyeOutline,
  'eye-off-outline': eyeOffOutline,
  send,
  'lock-closed': lockClosed,
  'walk-outline': walkOutline
});

// Cargar Google Maps API
const loadGoogleMapsScript = () => {
  if (typeof window !== 'undefined' && !document.querySelector('script[src*="maps.googleapis.com"]')) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
};

loadGoogleMapsScript();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-AR' },
    provideIonicAngular(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      IonicStorageModule.forRoot(),
      GoogleMapsModule
    ),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});

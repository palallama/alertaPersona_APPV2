import { Component, Input, OnInit, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  notificationsOutline,
  locationOutline,
  phonePortraitOutline,
  mailOutline
} from 'ionicons/icons';
import { Usuario, UsuarioPreferencia } from 'src/app/core/interfaces/usuario';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { firstValueFrom } from 'rxjs';
import { PREFERENCIAS_CONFIG, PreferenciaConfig, obtenerConfigPreferencia } from './preferences.data';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    IonToggle
  ]
})
export class PreferencesComponent implements OnInit, OnChanges {
  private usuarioService = inject(UsuarioService);

  @Input() usuario: Usuario | null = null;

  // Preferencias de usuario desde el backend
  preferenciasUsuario: UsuarioPreferencia[] = [];

  // Preferencias activas (claves que el usuario tiene)
  preferenciasActivas: Set<string> = new Set();

  // Configuración de preferencias disponibles
  preferenciasConfig = PREFERENCIAS_CONFIG;

  // Estado de permisos de ubicación
  locationPermissionStatus: string = 'Verificando permisos...';
  locationButtonText: string = 'Verificar';

  constructor() {
    addIcons({
      notificationsOutline,
      locationOutline,
      phonePortraitOutline,
      mailOutline
    });
  }

  ngOnInit() {
    if (this.usuario) {
      this.cargarPreferenciasUsuario();
      this.checkLocationPermissions();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['usuario'] && this.usuario) {
      this.cargarPreferenciasUsuario();
      this.checkLocationPermissions();
    }
  }

  async cargarPreferenciasUsuario() {
    try {
      if (this.usuario?.id) {
        const preferencias = await firstValueFrom(this.usuarioService.getUsuarioPreferencias(this.usuario.id)) as UsuarioPreferencia[];
        console.log('Preferencias cargadas:', preferencias);
        if (preferencias) {
          this.preferenciasUsuario = preferencias;
          // Crear un Set con las claves activas
          this.preferenciasActivas = new Set(preferencias.map(p => p.clave));
        }
      }
    } catch (error) {
      console.error('Error cargando preferencias:', error);
    }
  }

  async togglePreferencia(clave: string) {
    try {
      if (this.usuario?.id) {
        const estaActiva = this.preferenciasActivas.has(clave);
        
        // Crear objeto de preferencia para enviar al backend
        const preferencia: UsuarioPreferencia = {
          usuarioId: parseInt(this.usuario.id),
          clave: clave,
          usuario: this.usuario
        };

        await firstValueFrom(this.usuarioService.setDelUsuarioPreferencias(this.usuario.id, preferencia));
        
        // Actualizar el estado local
        if (estaActiva) {
          this.preferenciasActivas.delete(clave);
          // Eliminar de la lista
          this.preferenciasUsuario = this.preferenciasUsuario.filter(p => p.clave !== clave);
          console.log(`Preferencia ${clave} desactivada`);
        } else {
          this.preferenciasActivas.add(clave);
          // Agregar a la lista
          this.preferenciasUsuario.push(preferencia);
          console.log(`Preferencia ${clave} activada`);
        }
      }
    } catch (error) {
      console.error('Error actualizando preferencia:', error);
    }
  }

  /**
   * Verifica si una preferencia está activa
   */
  isPreferenciaActiva(clave: string): boolean {
    return this.preferenciasActivas.has(clave);
  }

  /**
   * Obtiene la configuración de una preferencia
   */
  getConfigPreferencia(clave: string): PreferenciaConfig | undefined {
    return obtenerConfigPreferencia(clave);
  }

  /**
   * Verifica los permisos de ubicación del dispositivo
   */
  async checkLocationPermissions() {
    try {
      this.locationPermissionStatus = 'Verificando...';
      this.locationButtonText = 'Verificando';

      if (!navigator.geolocation) {
        this.locationPermissionStatus = 'Geolocalización no disponible';
        this.locationButtonText = 'No disponible';
        return;
      }

      // Verificar permisos usando la API de permisos si está disponible
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        
        switch (permission.state) {
          case 'granted':
            this.locationPermissionStatus = 'Permisos concedidos';
            this.locationButtonText = 'Verificado';
            break;
          case 'denied':
            this.locationPermissionStatus = 'Permisos denegados';
            this.locationButtonText = 'Solicitar';
            break;
          case 'prompt':
            this.locationPermissionStatus = 'Permisos pendientes';
            this.locationButtonText = 'Solicitar';
            break;
        }
      } else {
        // Fallback para navegadores que no soportan la API de permisos
        this.requestLocationPermission();
      }
    } catch (error) {
      console.error('Error verificando permisos de ubicación:', error);
      this.locationPermissionStatus = 'Error verificando permisos';
      this.locationButtonText = 'Reintentar';
    }
  }

  /**
   * Solicita permisos de ubicación al usuario
   */
  private requestLocationPermission() {
    this.locationPermissionStatus = 'Solicitando permisos...';
    this.locationButtonText = 'Solicitando';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.locationPermissionStatus = 'Permisos concedidos';
        this.locationButtonText = 'Verificado';
        console.log('Ubicación obtenida:', position.coords);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.locationPermissionStatus = 'Permisos denegados por el usuario';
            this.locationButtonText = 'Denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            this.locationPermissionStatus = 'Ubicación no disponible';
            this.locationButtonText = 'No disponible';
            break;
          case error.TIMEOUT:
            this.locationPermissionStatus = 'Tiempo agotado';
            this.locationButtonText = 'Reintentar';
            break;
          default:
            this.locationPermissionStatus = 'Error desconocido';
            this.locationButtonText = 'Reintentar';
            break;
        }
        console.error('Error obteniendo ubicación:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }
}

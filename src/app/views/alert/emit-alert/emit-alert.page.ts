import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { GoogleMapsComponent, MapOptions } from '../../../components/google-maps/google-maps.component';
import { AlertStatusBadgeComponent } from '../../../components/alert-status-badge/alert-status-badge.component';
import { LocationDisplayComponent, LocationInfo } from '../../../components/location-display/location-display.component';
import { addIcons } from 'ionicons';
import { closeOutline, peopleOutline } from 'ionicons/icons';
import { AlertaEstados } from 'src/app/core/interfaces/alerta-estados';
import { Alerta } from 'src/app/core/interfaces/alerta';
import { Ubicacion } from 'src/app/core/interfaces/marcador';
import { Asistente, AsistenteAccion } from 'src/app/core/interfaces/asistente';
import { AlertaService } from 'src/app/core/services/alerta.service';
import { LocalizacionService } from 'src/app/core/services/localizacion.service';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from 'src/app/core/constants/placeholders';
import { UserStorageService } from 'src/app/core/services/user-storage';
import { AsistenteService } from 'src/app/core/services/asistente.service';
import { firstValueFrom } from 'rxjs';
import { AlertService } from 'src/app/components/alerta/alerta.service';

@Component({
  selector: 'app-emit-alert',
  templateUrl: './emit-alert.page.html',
  styleUrls: ['./emit-alert.page.scss'],
  standalone: true,
  imports: [
    IonIcon, 
    IonButton, 
    IonContent,
    CommonModule,
    GoogleMapsComponent,
    AlertStatusBadgeComponent,
    LocationDisplayComponent
  ]
})
export class EmitAlertPage implements OnInit, OnDestroy, ViewWillEnter, ViewWillLeave {
  AlertaEstados = AlertaEstados;
  
  private alertaService = inject(AlertaService);
  private asistenteService = inject(AsistenteService);
  private userStorage = inject(UserStorageService);
  private localizacionService = inject(LocalizacionService);
  private cdr = inject(ChangeDetectorRef);
  private alerts = inject(AlertService);
  
  // Intervalo para actualización periódica de asistentes
  private assistantUpdateInterval: any;
  private readonly UPDATE_INTERVAL_MS = 10000; // 10 segundos
  private lastAssistantCount = 0; // Para detectar cambios
  
  // Datos de la alerta actual
  alerta: Alerta = {
    usuarioId: '',
    estado: AlertaEstados.EMITIDA,
    latitud: DEFAULT_LATITUDE,
    longitud: DEFAULT_LONGITUDE,
    cerrada: false
  };
  
  // Lista de asistentes/contactos
  asistentes: Asistente[] = [];
  
  // Configuración del mapa (se inicializará con ubicación real)
  mapOptions: MapOptions | null = null;
  
  // Información de ubicación
  locationInfo: LocationInfo = {
    address: 'Obteniendo ubicación...',
    time: new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    coordinates: {
      lat: DEFAULT_LATITUDE,
      lng: DEFAULT_LONGITUDE
    }
  };

  constructor(private router: Router) {
    addIcons({ closeOutline, peopleOutline });
  }

  async ngOnInit() {
    await this.cargarUsuarioActual();
    await this.obtenerUbicacionActual();
    await this.crearAlerta();
  }

  ngOnDestroy() {
    // Limpiar el intervalo cuando se destruye el componente
    this.stopAssistantUpdates();
  }

  ionViewWillEnter() {
    // Reanudar actualizaciones cuando la vista va a entrar
    if (this.alerta.id && !this.alerta.cerrada && !this.assistantUpdateInterval) {
      this.startAssistantUpdates();
    }
  }

  ionViewWillLeave() {
    // Pausar actualizaciones cuando la vista va a salir (pero no destruir el componente)
    this.stopAssistantUpdates();
  }

  // ========== MÉTODOS DE INICIALIZACIÓN ==========
  
  private async cargarUsuarioActual() {
    try {
      const usuario = await this.userStorage.getUsuario();
      if (usuario) {
        this.alerta.usuarioId = usuario.id;
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  }
  
  private async obtenerUbicacionActual() {
    try {
      const coords = await this.localizacionService.obtenerLocalizacion();
      
      if (coords) {
        const ubicacion: Ubicacion = {
          latitud: coords.latitude,
          longitud: coords.longitude
        };
      
        this.alerta.latitud = ubicacion.latitud;
        this.alerta.longitud = ubicacion.longitud;
        
        // Inicializar el mapa con la ubicación real
        this.mapOptions = {
          center: { lat: ubicacion.latitud, lng: ubicacion.longitud },
          zoom: 16,
          markers: [{
            position: { lat: ubicacion.latitud, lng: ubicacion.longitud },
            title: 'Tu ubicación actual'
          }]
        };

        // Actualizar la información de ubicación
        this.locationInfo.coordinates = {
          lat: ubicacion.latitud,
          lng: ubicacion.longitud
        };
      } else {
        console.warn('No se obtuvieron coordenadas');
      }
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }

  // ========== MÉTODOS DE LA ALERTA ==========
  
  async onCancelAlert() {
    
    await this.alerts.showAlert({
      title: 'Seguro que desea cancelar la alerta?',
      // message: 'Una vez cancelada, sus contactos no serán notificados.',
      buttons: [
        { 
          text: 'Cancelar', 
          role: 'cancel',
          handler: () => {
            console.log('El usuario canceló');
            return true; // Cierra el alerta
          }
        },
        { 
          text: 'Aceptar', 
          role: 'confirm',
          handler: () => {
            this.cerrarAlerta(AlertaEstados.CANCELADA);
            return true; // Cierra el alerta
          }
        }
      ]
    });
  }

  async onMarkAsResolved() {
    await this.alerts.showAlert({
      title: 'Seguro que desea marcar la alerta como resuelta?',
      // message: 'Una vez marcada como resuelta, sus contactos no serán notificados.',
      buttons: [
        { 
          text: 'Cancelar', 
          role: 'cancel',
          handler: () => {
            console.log('El usuario canceló');
            return true; // Cierra el alerta
          }
        },
        { 
          text: 'Aceptar', 
          role: 'confirm',
          handler: () => {
            this.cerrarAlerta(AlertaEstados.SOLUCIONADA);
            return true; // Cierra el alerta
          }
        }
      ]
    });
  }

  private async cerrarAlerta(estado: AlertaEstados) {
    try {
      // Detener la actualización periódica antes de cerrar
      this.stopAssistantUpdates();
      
      if (this.alerta.id) {
        this.alerta.estado = estado;
        this.alerta.fchCierre = new Date();
        this.alerta.cerrada = true;
        
        await firstValueFrom(this.alertaService.cerrarAlerta(this.alerta.id, estado));
        console.log(`Alerta ${estado === AlertaEstados.CANCELADA ? 'cancelada' : 'solucionada'}`);
      }
      
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error cerrando alerta:', error);
    }
  }

  private async crearAlerta() {
    try {
      const nuevaAlerta = await firstValueFrom(this.alertaService.insertAlerta(this.alerta));
      if (nuevaAlerta && nuevaAlerta.id) {
        this.alerta.id = nuevaAlerta.id;
        this.getAsistentes();
        this.startAssistantUpdates(); // Iniciar actualizaciones periódicas
        console.log('Alerta creada con ID:', this.alerta.id);
      }
    } catch (error) {
      console.error('Error creando alerta:', error);
    }
  }

  getAsistentes() {
    if (!this.alerta.id) {
      console.warn('No se puede obtener asistentes: alerta.id no está definido');
      return;
    }
    
    console.log('Consultando asistentes para alerta ID:', this.alerta.id);
    this.asistenteService.getByAlertaId(this.alerta.id).subscribe({
      next: (data: any) => {
        console.log('Respuesta del servidor:', data);
        const newAsistentes = data || [];
        const newCount = newAsistentes.filter((a: Asistente) => a.estado === AsistenteAccion.ASISTE).length;
        const previousCount = this.asistentes.filter(a => a.estado === AsistenteAccion.ASISTE).length;
        
        // Detectar cambios en el número de asistentes
        // if (newCount !== previousCount) {
        //   console.log('Cambio en asistentes:', {
        //     antes: previousCount,
        //     ahora: newCount,
        //     nuevosAsistentes: newAsistentes.filter((a: Asistente) => a.estado === AsistenteAccion.ASISTE)
        //   });
        // }
        
        this.asistentes = newAsistentes;
        this.lastAssistantCount = this.asistentes.length;
        // console.log('Asistentes actualizados:', {
        //   total: this.asistentes.length,
        //   asistiendo: newCount,
        //   datos: this.asistentes
        // });
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error obteniendo asistentes:', error);
      }
    });
  }

  // ========== MÉTODOS DE ACTUALIZACIÓN PERIÓDICA ==========
  
  private startAssistantUpdates() {
    // Solo iniciar si no hay un intervalo activo
    if (this.assistantUpdateInterval) {
      return;
    }
    
    this.assistantUpdateInterval = setInterval(() => {
      // Solo actualizar si la alerta sigue activa
      if (this.alerta && !this.alerta.cerrada) {
        this.getAsistentes();
      } else {
        // Si la alerta se cerró, detener las actualizaciones
        this.stopAssistantUpdates();
      }
    }, this.UPDATE_INTERVAL_MS);
    
    console.log('Iniciadas actualizaciones periódicas de asistentes cada', this.UPDATE_INTERVAL_MS / 1000, 'segundos');
  }
  
  private stopAssistantUpdates() {
    if (this.assistantUpdateInterval) {
      clearInterval(this.assistantUpdateInterval);
      this.assistantUpdateInterval = null;
      console.log('Detenidas actualizaciones periódicas de asistentes');
    }
  }

  // ========== MÉTODOS DE UTILIDAD ==========
  
  getContactsSummary(): string {
    const asistiendo = this.asistentes.filter(a => a.estado === AsistenteAccion.ASISTE).length;
    const total = this.asistentes.length;
    return `${asistiendo}/${total}`;
  }

  getContactsNames(): string {
    
    const asistiendo = this.asistentes
      .filter(a => {
        return a.estado === AsistenteAccion.ASISTE;
      })
      .map(a => {
        // Usar nombre y apellido del objeto usuario si está disponible
        if (a.usuario) {
          return `${a.usuario.nombre} ${a.usuario.apellido}`;
        }
        // Fallback a observacion si no hay usuario
        return a.observacion || 'Sin nombre';
      });
    
    if (asistiendo.length > 0) {
      return asistiendo.join(', ');
    }
    
    return 'Ningún contacto notificado aún';
  }
}

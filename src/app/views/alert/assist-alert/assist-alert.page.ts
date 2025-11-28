import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonButton, IonIcon} from '@ionic/angular/standalone';
import { GoogleMapsComponent, MapOptions } from '../../../components/google-maps/google-maps.component';
import { AlertStatusBadgeComponent } from '../../../components/alert-status-badge/alert-status-badge.component';
import { LocationDisplayComponent, LocationInfo } from '../../../components/location-display/location-display.component';
import { addIcons } from 'ionicons';
import { warningOutline, checkmarkCircleOutline, closeCircleOutline, informationCircleOutline, homeOutline, walkOutline } from 'ionicons/icons';
import { AlertaEstados } from 'src/app/core/interfaces/alerta-estados';
import { Alerta } from 'src/app/core/interfaces/alerta';
import { Asistente, AsistenteAccion } from 'src/app/core/interfaces/asistente';
import { AlertaService } from 'src/app/core/services/alerta.service';
import { AsistenteService } from 'src/app/core/services/asistente.service';
import { LocalizacionService } from 'src/app/core/services/localizacion.service';
import { UserStorageService } from 'src/app/core/services/user-storage';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from 'src/app/core/constants/placeholders';
import { AlertService } from 'src/app/components/alerta/alerta.service';

@Component({
  selector: 'app-assist-alert',
  templateUrl: './assist-alert.page.html',
  styleUrls: ['./assist-alert.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    CommonModule,
    GoogleMapsComponent,
    AlertStatusBadgeComponent,
    LocationDisplayComponent
  ]
})
export class AssistAlertPage implements OnInit, OnDestroy {
  AlertaEstados = AlertaEstados;
  
  @ViewChild(GoogleMapsComponent) mapComponent!: GoogleMapsComponent;
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alertaService = inject(AlertaService);
  private asistenteService = inject(AsistenteService);
  private userStorage = inject(UserStorageService);
  private localizacionService = inject(LocalizacionService);
  private alerts = inject(AlertService);

  alerta?: Alerta;
  alertaId?: string;
  ubicacionUsuario?: { lat: number; lng: number };
  
  // Configuración del mapa - Se inicializará con los datos reales de la alerta
  mapOptions?: MapOptions;
  
  currentStatus: AlertaEstados = AlertaEstados.EMITIDA;
  
  // Control de estado de asistencia
  haRespondido: boolean = false; // Si ya respondió (asistió o rechazó)
  estaAsistiendo: boolean = false; // Si confirmó que va a asistir
  
  // Intervalo para verificar estado de la alerta
  private alertCheckInterval: any;
  private readonly ALERT_CHECK_INTERVAL_MS = 5000; // 5 segundos
  
  locationInfo: LocationInfo = {
    address: 'Cargando dirección...',
    time: new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    coordinates: {
      lat: DEFAULT_LATITUDE,
      lng: DEFAULT_LONGITUDE
    }
  };
  
  alertTitle: string = 'Solicitud de ayuda';
  alertDescription: string = 'Una persona necesita tu asistencia. Revisa la ubicación y decide si puedes ayudar.';
  
  isSubmitting: boolean = false;
  statusMessage: string = '';

  constructor() {
    addIcons({warningOutline,walkOutline,informationCircleOutline,homeOutline,checkmarkCircleOutline,closeCircleOutline});
  }

  ngOnInit() {
    this.alertaId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.alertaId) {
      this.cargarAlerta();
      this.startAlertStatusCheck(); // Iniciar verificación periódica
    }
    this.obtenerUbicacionUsuario();
  }

  ngOnDestroy() {
    // Limpiar el intervalo cuando se destruye el componente
    this.stopAlertStatusCheck();
  }

  // ========== MÉTODOS DE INICIALIZACIÓN ==========
  
  private async obtenerUbicacionUsuario() {
    try {
      const ubicacion = await this.localizacionService.obtenerLocalizacion();
      this.ubicacionUsuario = {
        lat: ubicacion.latitude,
        lng: ubicacion.longitude
      };
      console.log('Ubicación del usuario obtenida:', this.ubicacionUsuario);
    } catch (error) {
      console.error('Error obteniendo ubicación del usuario:', error);
    }
  }

  async cargarAlerta() {
    try {
      if (this.alertaId) {
        this.alertaService.getAlerta(this.alertaId).subscribe({
          next: async (data) => {
            const alerta = data as Alerta;
            this.alerta = alerta;
            
            if (alerta) {
              // Actualizar estado de la alerta
              const estadoAnterior = this.currentStatus;
              this.currentStatus = alerta.estado as AlertaEstados;
              
              // Verificar si la alerta se cerró mientras el usuario estaba asistiendo
              if (this.estaAsistiendo && this.isAlertaCerrada() && estadoAnterior !== this.currentStatus) {
                this.stopAlertStatusCheck();
                this.mostrarMensajeCierre();
              }
              
              // Actualizar configuración del mapa con la ubicación de la alerta
              if (alerta.latitud !== undefined && alerta.longitud !== undefined) {
                this.mapOptions = {
                  center: { lat: alerta.latitud, lng: alerta.longitud },
                  zoom: 16,
                  markers: [{
                    position: { lat: alerta.latitud, lng: alerta.longitud },
                    title: 'Persona que necesita asistencia'
                  }]
                };
                
                // Actualizar información de ubicación
                this.locationInfo.coordinates = {
                  lat: alerta.latitud,
                  lng: alerta.longitud
                };

                this.locationInfo.address = await firstValueFrom(this.localizacionService.getAddressFromCoordinates(alerta.latitud, alerta.longitud));

                if (alerta.fchEmision) {
                  this.locationInfo.time = new Date(alerta.fchEmision).toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                }
              }
            }
          },
          error: (error) => {
            console.error('Error cargando alerta:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error cargando alerta:', error);
    }
  }

  // ========== MÉTODOS DEL MAPA ==========
  
  onMapReady(mapInstance: any) {
    console.log('Mapa listo:', mapInstance);
  }

  onMapError(error: any) {
    console.error('Error en el mapa:', error);
  }

  // ========== MÉTODOS DE NAVEGACIÓN ==========
  
  private mostrarRuta() {
    if (!this.ubicacionUsuario || !this.alerta?.latitud || !this.alerta?.longitud) {
      console.error('No se puede mostrar la ruta: falta ubicación del usuario o de la alerta');
      return;
    }

    this.statusMessage = 'Mostrando ruta...';

    try {
      const origin = { lat: this.ubicacionUsuario.lat, lng: this.ubicacionUsuario.lng };
      const destination = { lat: this.alerta.latitud, lng: this.alerta.longitud };

      // Actualizar el mapa con la ruta usando el nuevo patrón
      this.mapOptions = {
        ...this.mapOptions!,
        route: {
          origin,
          destination
        },
        showRoute: true
      };

      this.mapComponent?.updateOptions(this.mapOptions);
      this.statusMessage = 'Ruta mostrada en el mapa';
      console.log('Ruta configurada en el mapa');

    } catch (error) {
      console.error('Error mostrando ruta:', error);
      this.statusMessage = 'No se pudo mostrar la ruta';
    }
  }

  // ========== MÉTODOS DE ASISTENCIA ==========

  async responderAsistencia(accion: AsistenteAccion) {
    if (!this.alerta?.id || this.isSubmitting) return;

    this.isSubmitting = true;

    try {
      const usuarioLogueado = await this.userStorage.getUsuario();
      if (!usuarioLogueado?.id) {
        throw new Error('Usuario no autenticado');
      }

      const asistencia: Asistente = {
        alertaId: this.alerta.id,
        usuarioId: parseInt(usuarioLogueado.id),
        estado: accion,
        observacion: ''
      };

      await this.asistenteService.insertAsistente(asistencia).toPromise();
      
      const mensaje = accion === AsistenteAccion.ASISTE 
        ? 'Has confirmado tu asistencia' 
        : 'Has rechazado la asistencia';
      
      console.log(mensaje);
      this.router.navigate(['/home']);
      
    } catch (error) {
      console.error('Error enviando respuesta:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  async onAcceptAssistWithRoute() {
    if (!this.alerta?.id || this.isSubmitting) return;

    this.isSubmitting = true;

    try {
      const usuarioLogueado = await this.userStorage.getUsuario();
      if (!usuarioLogueado?.id) {
        throw new Error('Usuario no autenticado');
      }

      const asistencia: Asistente = {
        alertaId: this.alerta.id,
        usuarioId: parseInt(usuarioLogueado.id),
        estado: AsistenteAccion.ASISTE,
        observacion: ''
      };

      await firstValueFrom(this.asistenteService.insertAsistente(asistencia));
      
      this.haRespondido = true;
      this.estaAsistiendo = true;
      
      this.statusMessage = 'Asistencia confirmada - Mostrando ruta...';
      console.log('Has confirmado tu asistencia - Mostrando ruta...');
      
      // Mostrar la ruta de caminata en el mapa
      this.mostrarRuta();
      
    } catch (error) {
      console.error('Error enviando respuesta:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  onRejectAssist() {
    this.responderAsistencia(AsistenteAccion.RECHAZA);
  }

  async onCerrarAlerta() {
    const resultado = await this.alerts.showInputAlert({
      title: 'Seguro que desea cerrar la alerta?',
      message: 'Declare un motivo de cierre: ',
      inputType: 'text',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: (valor) => {
            if (!valor) {
              console.log('El campo no puede estar vacío');
              return false; // Evita que se cierre
            }
            return true; // Permite que se cierre
          }
        }
      ]
    });

    // Verificar el resultado
    if (resultado?.role === 'confirm') {
      console.log('Valor ingresado:', resultado.value);
      this.volverAlHome();
    } else {
      console.log('El usuario canceló la operación');
    }
  }

  // ========== MÉTODOS DE UTILIDAD ==========
  
  /**
   * Verifica si la alerta está cerrada (Cancelada, Solucionada o Expirada)
   */
  isAlertaCerrada(): boolean {
    return this.currentStatus === AlertaEstados.CANCELADA ||
           this.currentStatus === AlertaEstados.SOLUCIONADA ||
           this.currentStatus === AlertaEstados.EXPIRADA;
  }

  volverAlHome() {
    this.stopAlertStatusCheck();
    this.router.navigate(['/home']);
  }

  // ========== MÉTODOS DE VERIFICACIÓN PERIÓDICA ==========

  private startAlertStatusCheck() {
    // Solo iniciar si no hay un intervalo activo
    if (this.alertCheckInterval) {
      return;
    }
    
    this.alertCheckInterval = setInterval(() => {
      // Solo verificar si el usuario está asistiendo
      if (this.estaAsistiendo) {
        console.log('🔄 Verificando estado de la alerta...');
        this.cargarAlerta();
      }
    }, this.ALERT_CHECK_INTERVAL_MS);
    
  }
  
  private stopAlertStatusCheck() {
    if (this.alertCheckInterval) {
      clearInterval(this.alertCheckInterval);
      this.alertCheckInterval = null;
    }
  }

  private async mostrarMensajeCierre() {
    let mensaje = 'La alerta ha sido cerrada';
    
    if (this.currentStatus === AlertaEstados.CANCELADA) {
      mensaje = 'La alerta fue cancelada por quien la emitió';
    } else if (this.currentStatus === AlertaEstados.SOLUCIONADA) {
      mensaje = 'La alerta fue marcada como solucionada';
    } else if (this.currentStatus === AlertaEstados.EXPIRADA) {
      mensaje = 'La alerta ha expirado';
    }
    
    
    await this.alerts.showAlert({
      title: 'Alerta cerrada',
      message: mensaje,
      buttons: [
        { 
          text: 'Aceptar', 
          role: 'confirm',
          handler: () => {  
            // Redirigir al home después de 2 segundos
            setTimeout(() => {
              this.volverAlHome();
            }, 2000);
            return true; // Cierra el alerta
          }
        }
      ]
    });
  }

}

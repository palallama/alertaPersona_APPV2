import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonButton, 
  IonIcon, 
  IonBadge, 
  IonPopover, 
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonAvatar,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, notificationsOutline, location, time } from 'ionicons/icons';
import { AlertaContactoService } from 'src/app/core/services/alerta-contacto.service';
import { Alerta } from 'src/app/core/interfaces/alerta';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alertas-notificaciones',
  templateUrl: './alertas-notificaciones.component.html',
  styleUrls: ['./alertas-notificaciones.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonBadge,
    IonPopover,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonText
  ]
})
export class AlertasNotificacionesComponent implements OnInit, OnDestroy {
  private alertaContactoService = inject(AlertaContactoService);
  private router = inject(Router);
  private subscription?: Subscription;

  alertasActivas = this.alertaContactoService.alertasActivas;
  alertasCount = this.alertaContactoService.alertasActivasCount;
  
  isPopoverOpen = false;

  constructor() {
    addIcons({ notifications, notificationsOutline, location, time });
  }

  ngOnInit() {
    // Iniciar actualización automática cada 30 segundos
    this.subscription = this.alertaContactoService.iniciarActualizacionAutomatica(30000)
      .subscribe();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  togglePopover(event: Event) {
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  closePopover() {
    this.isPopoverOpen = false;
  }

  verAlerta(alerta: Alerta) {
    // Marcar como vista
    this.alertaContactoService.marcarAlertaComoVista(alerta.id!).subscribe();
    
    // Navegar a la vista de asistencia de alerta
    this.router.navigate(['/assist-alert', alerta.id]);
    this.closePopover();
  }

  getTiempoTranscurrido(timestamp: Date): string {
    const ahora = new Date();
    const fecha = new Date(timestamp);
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  }

  getNombreCompleto(alerta: Alerta): string {
    return `${alerta.usuario?.nombre} ${alerta.usuario?.apellido}`;
  }
}

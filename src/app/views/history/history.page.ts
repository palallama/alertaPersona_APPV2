import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonSegment, 
  IonSegmentButton, 
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonChip,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { swapVertical, calendarOutline } from 'ionicons/icons';
import { FooterComponent } from '../../components/footer/footer.component';
import { Alerta, AlertaHistorial, Historial } from 'src/app/core/interfaces/alerta';
import { AlertaEstados, getEstadoDescripcion } from 'src/app/core/interfaces/alerta-estados';
import { AlertaService } from 'src/app/core/services/alerta.service';
import { AlertaHistoriaService } from 'src/app/core/services/alerta-historia.service';
import { UsuarioLogueado } from 'src/app/core/interfaces/usuario';
import { UserStorageService } from 'src/app/core/services/user-storage';
import { AlertasNotificacionesComponent } from 'src/app/components/alertas-notificaciones/alertas-notificaciones.component';


@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonSegment, 
    IonSegmentButton, 
    IonLabel,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonChip,
    IonRefresher,
    IonRefresherContent,
    CommonModule, 
    FormsModule,
    AlertasNotificacionesComponent,
    FooterComponent
  ]
})
export class HistoryPage implements OnInit {
  private alertaHistoriaService = inject(AlertaHistoriaService);
  private userStorage = inject(UserStorageService);

  selectedTab: string = 'todas';
  sortByRecent: boolean = true;

  usuarioLoggeado!: UsuarioLogueado;
  AlertaEstados = AlertaEstados;
  alertasHistorial: AlertaHistorial[] = [];

  constructor() {
    addIcons({ swapVertical, calendarOutline });
  }

  async ngOnInit() {
    this.usuarioLoggeado = (await this.userStorage.getUsuario())!;
    console.log('Usuario loggeado:', this.usuarioLoggeado);
    this.cargarHistorial();
  }

  async cargarHistorial() {
    this.alertaHistoriaService.getHistorialUsuario(this.usuarioLoggeado.id).subscribe({
      next: (historial: Historial) => {
        if (historial) {
          this.alertasHistorial = this.combinarHistorial(historial);
        }
      },
      error: (error) => {
        console.error('Error cargando historial:', error);
      }
    });
  }

  private combinarHistorial(historial: Historial): AlertaHistorial[] {
    const todas: AlertaHistorial[] = [];
    
    // Agregar alertas emitidas
    historial.emitidas.forEach(item => {
      todas.push(item);
    });
    
    // Agregar alertas asistidas
    historial.asistidas.forEach(item => {
      todas.push(item);
    });
    
    return todas;
  }

  get filteredAlerts(): AlertaHistorial[] {
    let filtered = this.alertasHistorial;

    // Filtrar por tab seleccionado
    switch (this.selectedTab) {
      case 'emitidas':
        filtered = filtered.filter(alert => alert.tipo === 'emitida');
        break;
      case 'asistidas':
        filtered = filtered.filter(alert => alert.tipo === 'asistida');
        break;
      default:
        // 'todas' - mostrar todas
        break;
    }

    // Ordenar por fecha
    if (this.sortByRecent) {
      filtered = filtered.sort((a, b) => {
        const dateA = a.fchEmision ? new Date(a.fchEmision).getTime() : 0;
        const dateB = b.fchEmision ? new Date(b.fchEmision).getTime() : 0;
        return dateB - dateA;
      });
    }

    return filtered;
  }

  onTabChange(event: any) {
    this.selectedTab = event.detail.value;
  }

  toggleSort() {
    this.sortByRecent = !this.sortByRecent;
  }

  getStatusColor(estado: string): string {
    switch (estado) {
      case 'S': // Solucionada
        return 'success';
      case 'C': // Cancelada
        return 'danger';
      case 'E': // Emitida
        return 'warning';
      case 'X': // Expirada
        return 'medium';
      default:
        return 'medium';
    }
  }

  getStatusText(estado: string): string {
    switch (estado) {
      case 'S':
        return 'Solucionada';
      case 'C':
        return 'Cancelada';
      case 'E':
        return 'Emitida';
      case 'X':
        return 'Expirada';
      default:
        return 'Desconocido';
    }
  }

  getTypeColor(tipo: string): string {
    switch (tipo) {
      case 'emitida':
        return 'primary';
      case 'asistida':
        return 'tertiary';
      default:
        return 'medium';
    }
  }

  getTypeText(tipo: string): string {
    switch (tipo) {
      case 'emitida':
        return 'Emitida';
      case 'asistida':
        return 'Asistida';
      default:
        return 'Desconocido';
    }
  }

  // Métodos de utilidad para mostrar fechas formateadas
  getFormattedDate(alerta: AlertaHistorial): string {
    if (!alerta.fchEmision) return 'Fecha no disponible';
    return new Date(alerta.fchEmision).toLocaleDateString('es-ES');
  }

  getFormattedTime(alerta: AlertaHistorial): string {
    if (!alerta.fchEmision) return 'Hora no disponible';
    return new Date(alerta.fchEmision).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para obtener información del usuario (para alertas asistidas)
  getUsuarioInfo(alerta: AlertaHistorial): string {
    if (alerta.tipo === 'asistida') {
      return `${alerta.usuario!.nombre} ${alerta.usuario!.apellido}` || 'Usuario no disponible';
    }
    return '';
  }

  // Método para obtener cantidad de asistentes (para alertas emitidas)
  getAsistentesCount(alerta: AlertaHistorial): number {
    if (alerta.tipo === 'emitida' && alerta.asistentes) {
      return alerta.asistentes.length;
    }
    return 0;
  }

  async handleRefresh(event: any) {
    await this.cargarHistorial();
    event.target.complete();
  }
}

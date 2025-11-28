import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, time, syncOutline, closeCircle } from 'ionicons/icons';
import { AlertaEstados, getEstadoDescripcion, getEstadoIcon } from 'src/app/core/interfaces/alerta-estados';
import { getFormattedTime } from 'src/app/utils/datetime-utils';
import { ElapsedTimerComponent } from '../elapsed-timer/elapsed-timer.component';

@Component({
  selector: 'app-alert-status-badge',
  templateUrl: './alert-status-badge.component.html',
  styleUrls: ['./alert-status-badge.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, ElapsedTimerComponent]
})
export class AlertStatusBadgeComponent implements OnInit, OnDestroy {

  @Input() status: AlertaEstados = AlertaEstados.EMITIDA;
  @Input() showTimer: boolean = true;
  @Input() customMessage?: string;

  getFormattedTime = getFormattedTime;
  AlertaEstados = AlertaEstados

  constructor() {
    addIcons({ checkmarkCircle, time, syncOutline, closeCircle });
  }

  ngOnInit() {
    // Ya no necesitamos manejar timer aquí
  }

  ngOnDestroy() {
    // Cleanup si es necesario
  }

  /**
   * Actualiza el estado del badge
   */
  updateStatus(newStatus: AlertaEstados) {
    this.status = newStatus;
  }

  /**
   * Obtiene el mensaje según el estado
   */
  getStatusMessage(): string {
    if (this.customMessage) {
      return this.customMessage;
    }
    return getEstadoDescripcion(this.status);
  }

  /**
   * Obtiene la clase CSS según el estado
   */
  getStatusClass(): string {
    switch (this.status) {
      case AlertaEstados.EMITIDA:
        return 'status-emitida';
      case AlertaEstados.SOLUCIONADA:
        return 'status-solucionada';
      case AlertaEstados.CANCELADA:
        return 'status-cancelada';
      case AlertaEstados.EXPIRADA:
        return 'status-expirada';
      default:
        return 'status-unknown';
    }
    // return `status-${this.status}`;
  }

  /**
   * Obtiene el ícono según el estado
   */
  getStatusIcon(): string {
    return getEstadoIcon(this.status);
  }

  /**
   * Indica si el timer debería estar activo
   */
  isTimerActive(): boolean {
    return this.status === AlertaEstados.EMITIDA && this.showTimer;
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForward } from 'ionicons/icons';
import { AlertaService } from 'src/app/core/services/alerta.service';
import { LocalizacionService } from 'src/app/core/services/localizacion.service';
import { NotificacionService } from 'src/app/core/services/notificacion.service';
import { emitirAlerta } from 'src/app/core/common/alerta';
import { appLogo, appTitle } from 'src/app/core/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  alertaService = inject(AlertaService);
  localizacionService = inject(LocalizacionService);
  notificacionService = inject(NotificacionService);
  router = inject(Router);
  appLogo = appLogo;
  appTitle = appTitle;

  startX: number = 0;
  startY: number = 0;
  currentX: number = 0;
  currentY: number = 0;
  isDragging: boolean = false;
  threshold: number = 60; // Distancia mínima para activar la alerta
  cancelThreshold: number = 60; // Distancia para cancelar
  buttonElement: HTMLElement | null = null;

  constructor() {
    addIcons({ arrowForward });
  }

  ngOnInit() {
  }

  onTouchStart(event: TouchEvent) {
    event.preventDefault();

    const touch = event.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.currentX = touch.clientX;
    this.currentY = touch.clientY;
    this.isDragging = false;
  
    this.buttonElement = (event.currentTarget as HTMLElement);
    this.buttonElement.classList.add('ripple');
  }

  onTouchMove(event: TouchEvent) {
    if (!this.buttonElement) return;
    
    const touch = event.touches[0];
    this.currentX = touch.clientX;
    this.currentY = touch.clientY;
    
    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;
    const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (!this.isDragging && totalDistance > 5) {
      this.isDragging = true;
      this.buttonElement.classList.add('dragging');
    }
    
    // Si está arrastrando, mover el botón
    if (this.isDragging) {
      // Limitar el movimiento para que no se vaya muy lejos
      const maxDistance = 80;
      const limitedDeltaX = Math.max(-maxDistance, Math.min(maxDistance, deltaX));
      const limitedDeltaY = Math.max(-maxDistance, Math.min(maxDistance, deltaY));
      
      this.buttonElement.style.transform = `translate(${limitedDeltaX}px, ${limitedDeltaY}px)`;
      
      // Cambiar la opacidad basada en la distancia
      const opacity = Math.max(0.7, 1 - (totalDistance / 100));
      this.buttonElement.style.opacity = opacity.toString();
    }
    
    event.preventDefault();
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.buttonElement) return;
    
    this.buttonElement.classList.remove('ripple', 'dragging');
    
    if (this.isDragging) {
      const deltaX = this.currentX - this.startX;
      const deltaY = this.currentY - this.startY;
      const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Verificar si está cerca del centro para cancelar
      if (totalDistance <= this.cancelThreshold) {
        console.log('Alerta cancelada - botón regresado al centro');
        this.showCancelFeedback();
      } else if (totalDistance > this.threshold) {
        // Solo activar si está lejos del centro
        this.triggerAlert();
      }
      
      // Animar el retorno del botón a su posición original
      this.buttonElement.style.transition = 'all 0.3s ease-out';
      this.buttonElement.style.transform = 'translate(0px, 0px)';
      this.buttonElement.style.opacity = '1';
      
      // Limpiar la transición después de la animación
      setTimeout(() => {
        if (this.buttonElement) {
          this.buttonElement.style.transition = '';
        }
      }, 300);
    } else {
      // Si no fue un deslizamiento, restaurar inmediatamente
      this.buttonElement.style.transform = 'translate(0px, 0px)';
      this.buttonElement.style.opacity = '1';
    }
    
    this.isDragging = false;
    this.buttonElement = null;
  }

  private showCancelFeedback() {
    // Feedback visual de cancelación
    if (this.buttonElement) {
      this.buttonElement.classList.add('cancelled');
      setTimeout(() => {
        if (this.buttonElement) {
          this.buttonElement.classList.remove('cancelled');
        }
      }, 400);
    }
    
    // Vibración suave para indicar cancelación
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    console.log('Intención de alerta cancelada');
  }

  private async triggerAlert() {
    // Agregar animación de activación
    if (this.buttonElement) {
      this.buttonElement.classList.add('alert-activated');
      setTimeout(() => {
        if (this.buttonElement) {
          this.buttonElement.classList.remove('alert-activated');
        }
      }, 600);
    }
    
    // Feedback visual/táctil
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    try {
      emitirAlerta(this.localizacionService, this.router);
    } catch (error) {
      console.error('Error activando alerta:', error);
      alert('Error al activar la alerta. Intenta nuevamente.');
    }
  }
}

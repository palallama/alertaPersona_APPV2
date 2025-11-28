import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';

export interface LocationInfo {
  address: string;
  time?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

@Component({
  selector: 'app-location-display',
  templateUrl: './location-display.component.html',
  styleUrls: ['./location-display.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class LocationDisplayComponent {

  @Input() locationInfo: LocationInfo = {
    address: 'Ubicación no disponible',
    time: new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  };

  @Input() title: string = 'Tu ubicación';

  @Input() showTime: boolean = true;
  
  @Input() isCompact: boolean = false;
  @Input() isOverlay: boolean = false; // Para cuando se usa como badge sobre el mapa

  constructor() {
    addIcons({ locationOutline });
  }

  /**
   * Formatea la hora para mostrar
   */
  getFormattedTime(): string {
    if (!this.locationInfo.time) {
      return new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return this.locationInfo.time;
  }

  /**
   * Obtiene la dirección para mostrar
   */
  getDisplayAddress(): string {
    return this.locationInfo.address || 'Ubicación no disponible';
  }

  /**
   * Actualiza la ubicación
   */
  updateLocation(newLocation: LocationInfo) {
    this.locationInfo = { ...newLocation };
  }
}
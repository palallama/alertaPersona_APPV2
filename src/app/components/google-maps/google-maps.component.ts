import { Component, OnInit, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, MapMarker, MapDirectionsRenderer, MapDirectionsService } from '@angular/google-maps';
import { LoadingComponent } from '../loading/loading.component';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';

export interface MapLocation {
  lat: number;
  lng: number;
}

export interface MapMarkerData {
  position: MapLocation;
  title?: string;
  snippet?: string;
}

export interface MapRoute {
  origin: MapLocation;
  destination: MapLocation;
}

export interface MapOptions {
  center: MapLocation;
  zoom?: number;
  markers?: MapMarkerData[];
  route?: MapRoute;
  showRoute?: boolean;
}

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, LoadingComponent, GoogleMap, MapMarker, MapDirectionsRenderer]
})
export class GoogleMapsComponent implements OnInit {
  private mapDirectionsService = inject(MapDirectionsService);
  
  @Input() options: MapOptions = { center: { lat: -39.956, lng: -71.071 }, zoom: 16 };
  @Input() height: string = '100%';
  @Input() width: string = '100%';
  @Input() loadingMessage: string = 'Cargando mapa...';
  @Output() mapReady = new EventEmitter<any>();
  @Output() mapError = new EventEmitter<any>();
  
  hasValidApiKey = false;
  isLoading = true;
  hasError = false;
  errorMessage = '';
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 16;
  markers: MapMarkerData[] = [];
  directionsResults: Observable<google.maps.DirectionsResult | undefined> | null = null;
  showDirections = false;
  mapOptions: google.maps.MapOptions = { 
    scrollwheel: true, 
    zoomControl: true, 
    disableDefaultUI: true, 
    gestureHandling: 'auto' 
  };
  private apiKey = environment.googleMapsApiKey;

  constructor() {
    this.hasValidApiKey = !!(this.apiKey && this.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE');
  }

  ngOnInit() { 
    this.initializeMap(); 
  }

  initializeMap() {
    if (!this.hasValidApiKey) { 
      this.handleError('API Key no configurada'); 
      return; 
    }
    try {
      this.center = this.options.center;
      this.zoom = this.options.zoom || 16;
      if (this.options.markers) { 
        this.markers = this.options.markers;
      }
      if (this.options.showRoute && this.options.route) { 
        this.calculateRoute(this.options.route);
      }
      this.isLoading = false;
    } catch (error) {
      this.handleError('Error: ' + error);
    }
  }

  onMapReady(map: any) { 
    console.log('Mapa Google Maps listo');
    this.mapReady.emit(map); 
  }
  
  onMapClick(event: any) {}
  
  onMarkerClick(marker: MapMarkerData) {}
  
  calculateRoute(route: MapRoute) {
    const request: google.maps.DirectionsRequest = {
      origin: route.origin,
      destination: route.destination,
      travelMode: google.maps.TravelMode.WALKING
    };
    this.directionsResults = this.mapDirectionsService.route(request).pipe(
      map(response => {
        if (response.result) {
          this.showDirections = true;
          return response.result;
        }
        return undefined;
      })
    );
  }

  updateOptions(newOptions: Partial<MapOptions>) {
    this.options = { ...this.options, ...newOptions };
    if (newOptions.center) { 
      this.center = newOptions.center;
    }
    if (newOptions.zoom) { 
      this.zoom = newOptions.zoom;
    }
    if (newOptions.markers) { 
      this.markers = newOptions.markers;
    }
    if (newOptions.showRoute && newOptions.route) { 
      this.calculateRoute(newOptions.route);
    }
  }

  private handleError(message: string) {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = message;
    this.mapError.emit(message);
  }
}

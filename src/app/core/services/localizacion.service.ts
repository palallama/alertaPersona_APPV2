import { inject, Injectable } from '@angular/core';
import { Ubicacion } from '../interfaces/marcador';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

// Declaración para Google Maps
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class LocalizacionService {
  private http = inject(HttpClient);

  async obtenerLocalizacion(){
    // const coordinates = await Geolocation.getCurrentPosition();
    await new Promise(resolve => setTimeout(resolve, 3000)); // espera 3 seg
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000, // opcional
      maximumAge: 0    // fuerza a no usar cache
    });
    return coordinates.coords;
  }

  async calcularDistancia(ori:Ubicacion, des:Ubicacion) {
    if (typeof google !== 'undefined' && google.maps && google.maps.geometry) {
      return google.maps.geometry.spherical.computeDistanceBetween(
        {lat: ori.latitud, lng: ori.longitud}, 
        {lat: des.latitud, lng: des.longitud}
      );
    } else {
      // Fallback usando fórmula de Haversine si Google Maps no está disponible
      const R = 6371e3; // Radio de la Tierra en metros
      const φ1 = ori.latitud * Math.PI/180;
      const φ2 = des.latitud * Math.PI/180;
      const Δφ = (des.latitud-ori.latitud) * Math.PI/180;
      const Δλ = (des.longitud-ori.longitud) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      return R * c;
    }
  }

  getAddressFromCoordinates(lat: number, lng: number) {
    // const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + environment.googleMapsApiKey).pipe(
      map( (res:any) => {
        console.log(res);
        if(res.status === 'OK' && res.results.length > 0) {
          return res.results[0].formatted_address;
        }
        return 'Dirección no encontrada';
      })
    );
  }

}

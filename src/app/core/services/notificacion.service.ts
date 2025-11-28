import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { StorageKeys } from '../interfaces/storage';

@Injectable({
  providedIn: 'root'
})

export class NotificacionService {
  private route = inject(Router);
  private http = inject(HttpClient);
  private storageService = inject(StorageService);


  async iniciarNotificaciones() {
    if (Capacitor.getPlatform() !== "web"){
      await this.registerPush();
    }
  }

  private async registerPush() {

    try {
      await this.addListeners();

      
      let permisoNotificacion = await PushNotifications.checkPermissions();
      // console.log(permisoNotificacion.receive)
      
      permisoNotificacion = await PushNotifications.requestPermissions();
      // console.log(permisoNotificacion.receive)

      if (permisoNotificacion.receive === 'prompt') {
        permisoNotificacion = await PushNotifications.requestPermissions();
      }
      if (permisoNotificacion.receive !== 'granted'){
        throw new Error("Permisos de notificacion desactivados");
      }

      console.log("notificacion token: ", await this.storageService.get(StorageKeys.TOKEN_NOTIFICACION));

      if ((await this.storageService.get(StorageKeys.TOKEN_NOTIFICACION)) === null){
        await PushNotifications.register();
      }
    } catch (error) {
      console.error("Error al registrar notificaciones push:", error);
      // Si falta google-services.json, el error será más visible aquí
    }


  }

  private async addListeners() {
    await PushNotifications.addListener('registration', token => {
      // console.log('Registration token: ', token.value);
      this.storageService.set(StorageKeys.TOKEN_NOTIFICACION, token.value);
      // alert("Push registration success, token: " +token.value);
    });
  
    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
      alert('Registration error: ' + JSON.stringify(err));
    });
  
    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });
  
    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('*****Push notification action performed');
      console.log(notification);
      // alert('Registration error: ' + JSON.stringify(notification));

      if (notification.notification.data.motivo === 'A'){
        this.route.navigateByUrl('/assist-alert/' + notification.notification.data.alerta);
      }

    });
  }

  private urlBase64ToUint8Array(base64String:any) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

}

import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { AlertButton } from './alerta';
import { AlertaComponent } from './alerta/alerta.component';
import { AlertaInputComponent } from './alerta-input/alerta-input.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService  {
  constructor(private modalCtrl: ModalController) {}

  async showAlert(options: {
    title?: string;
    message?: string;
    buttons?: AlertButton[];
    cssClass?: string;
    showCloseButton?: boolean;
    backdropDismiss?: boolean;
    // disableBackdropClose?: boolean;
  }): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AlertaComponent,
      componentProps: {
        title: options.title,
        message: options.message,
        buttons: options.buttons || [{ text: 'OK' }],
        cssClass: options.cssClass,
        showCloseButton: options.showCloseButton ?? true // Default true
      },
      cssClass: `custom-alert-modal ${options.cssClass || ''}`,
      backdropDismiss: options.backdropDismiss ?? true,
      mode: 'md', // Forzar modo Material Design para consistencia
      animated: true,
    });
    
    return await modal.present();
  }
  async showInputAlert(options: {
    title?: string;
    message?: string;
    inputPlaceholder?: string;
    inputValue?: string;
    inputType?: 'text' | 'number' | 'email' | 'password' | 'textarea';
    buttons?: AlertButton[];
    cssClass?: string;
    showCloseButton?: boolean;
    backdropDismiss?: boolean;
  }): Promise<{ role?: string; value?: string }> { // ← Tipo de retorno explícito
    
    const modal = await this.modalCtrl.create({
      component: AlertaInputComponent,
      componentProps: {
        title: options.title,
        message: options.message,
        inputPlaceholder: options.inputPlaceholder || 'Ingrese texto',
        inputValue: options.inputValue || '',
        inputType: options.inputType || 'text',
        buttons: options.buttons || [
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Aceptar', role: 'confirm' }
        ],
        cssClass: options.cssClass,
        showCloseButton: options.showCloseButton ?? true
      },
      cssClass: `custom-alert-modal ${options.cssClass || ''}`,
      backdropDismiss: options.backdropDismiss ?? true
    });
    
    await modal.present();
    
    // Esperar a que el modal se cierre y obtener los datos
    const { data } = await modal.onWillDismiss();
    return data || {}; // ← Asegura que siempre retorne un objeto
  }
}

// async showInputAlert(options: {
//   // ... configuraciones anteriores
// }): Promise<{role?: string, value?: string}> {
//   const modal = await this.createAlert({
//     component: InputAlertComponent,
//     componentProps: {
//       // ... props anteriores
//     }
//   });
  
//   await modal.present();
//   const { data } = await modal.onWillDismiss();
//   return data;
// }

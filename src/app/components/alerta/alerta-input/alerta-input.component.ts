import { Component, Input, OnInit } from '@angular/core';
import { AlertButton } from '../alerta';
import { AlertaBaseComponent } from '../alerta-base/alerta-base.component';
import { TextInputComponent } from '../../input/text-input/text-input.component';
import { IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alerta-input',
  templateUrl: './alerta-input.component.html',
  styleUrls: ['./alerta-input.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    TextInputComponent
  ]
})
export class AlertaInputComponent extends AlertaBaseComponent {
  @Input() inputPlaceholder: string = 'Ingrese texto';
  @Input() inputValue: string = '';
  @Input() inputType: 'text' | 'number' | 'email' | 'password' | 'textarea' = 'text';

  override async onButtonClick(button: AlertButton) {
    const shouldClose = !button.handler || await button.handler(this.inputValue);
    
    if (shouldClose !== false) {
      await this.modalCtrl.dismiss({
        role: button.role,
        value: this.inputValue // ← Asegúrate de enviar este valor
      });
    }
  }
}

/*

import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-input-alert',
  templateUrl: './input-alert.component.html',
  styleUrls: ['./base-alert.component.scss']
})
export class InputAlertComponent extends BaseAlertComponent {
  @Input() inputPlaceholder: string = 'Ingrese texto';
  @Input() inputValue: string = '';
  @Input() inputType: 'text' | 'number' | 'email' | 'password' | 'textarea' = 'text';

  override async onButtonClick(button: AlertButton) {
    const shouldClose = !button.handler || await button.handler(this.inputValue);
    
    if (shouldClose !== false) {
      await this.modalCtrl.dismiss({
        role: button.role,
        value: this.inputValue // ← Asegúrate de enviar este valor
      });
    }
  }
}

*/
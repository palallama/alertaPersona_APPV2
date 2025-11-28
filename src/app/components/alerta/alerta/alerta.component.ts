import { Component, OnInit } from '@angular/core';
import { AlertaBaseComponent } from '../alerta-base/alerta-base.component';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.scss'],
  imports: [
    IonButton,
  ],
})
export class AlertaComponent extends AlertaBaseComponent {}

import { Component, OnInit } from '@angular/core';
import { AlertaBaseComponent } from '../alerta-base/alerta-base.component';
import { IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
  ],
})
export class AlertaComponent extends AlertaBaseComponent {}

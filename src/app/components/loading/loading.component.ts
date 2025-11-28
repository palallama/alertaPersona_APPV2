import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [CommonModule, IonSpinner]
})
export class LoadingComponent {
  @Input() message: string = 'Cargando...';
  @Input() size: 'small' | 'large' = 'large';
  @Input() color: string = 'primary';
  @Input() showBackground: boolean = true;
}
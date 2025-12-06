import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { AlertButton } from '../alerta';

@Component({
  selector: 'app-alerta-base',
  templateUrl: './alerta-base.component.html',
  styleUrls: ['./alerta-base.component.scss'],
  standalone: true,
})
export abstract class AlertaBaseComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttons: AlertButton[] = [{ text: 'OK' }];
  @Input() cssClass: string = '';
  @Input() showCloseButton: boolean = false;
  @Input() backdropDismiss: boolean = true;

  @Output() closed = new EventEmitter<void>();

  protected modalCtrl = inject(ModalController);

  async onButtonClick(button: AlertButton, inputValue?: any) {
    const shouldClose = !button.handler || await button.handler(inputValue);

    if (shouldClose !== false) {
      await this.dismiss();
    }
  }

  async handleBackdropClick(event: MouseEvent) {
    if (this.backdropDismiss && (event.target as HTMLElement).classList.contains('custom-alert-backdrop')) {
      await this.dismiss();
    }
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
    this.closed.emit();
  }
}

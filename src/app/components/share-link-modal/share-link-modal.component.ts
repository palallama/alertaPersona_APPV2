import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonContent, 
  IonSpinner, 
  IonItem, 
  IonLabel, 
  IonInput,
  ModalController 
} from '@ionic/angular/standalone';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-share-link-modal',
  templateUrl: './share-link-modal.component.html',
  styleUrls: ['./share-link-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonSpinner,
    IonItem,
    IonLabel,
    IonInput
  ]
})
export class ShareLinkModalComponent implements OnInit {
  @Input() shareLink: string = '';
  @Input() title: string = 'Compartir enlace';
  
  qrCodeDataURL: string = '';
  copySuccess: boolean = false;

  constructor(private modalController: ModalController) {}

  async ngOnInit() {
    if (this.shareLink) {
      await this.generateQRCode();
    }
  }

  async generateQRCode() {
    try {
      this.qrCodeDataURL = await QRCode.toDataURL(this.shareLink, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('Error generando QR code:', error);
    }
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.shareLink);
      this.copySuccess = true;
      
      // Resetear el estado después de 2 segundos
      setTimeout(() => {
        this.copySuccess = false;
      }, 2000);
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
      // Fallback para navegadores que no soportan clipboard API
      this.fallbackCopyToClipboard();
    }
  }

  fallbackCopyToClipboard() {
    const textArea = document.createElement('textarea');
    textArea.value = this.shareLink;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 2000);
    } catch (error) {
      console.error('Error en fallback copy:', error);
    }
    
    document.body.removeChild(textArea);
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}

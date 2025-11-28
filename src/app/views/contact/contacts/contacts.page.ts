import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonBadge,
  IonButtons,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personAddOutline,
  shareOutline,
  settingsOutline,
  closeOutline,
  timeOutline,
  chevronForwardOutline,
  personOutline,
  checkmarkOutline,
  closeCircleOutline
} from 'ionicons/icons';
import { Contacto, EstadoContacto } from '../../../core/interfaces/contacto';
import { ShareLinkModalComponent } from '../../../components/share-link-modal/share-link-modal.component';
import { ContactoService } from 'src/app/core/services/contacto';
import { UserStorageService } from 'src/app/core/services/user-storage';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
  standalone: true,
  providers: [ModalController, ToastController],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonToggle,
    IonBadge,
    IonButtons,
    IonMenuButton,
    IonRefresher,
    IonRefresherContent,
    CommonModule,
    FormsModule
  ]
})
export class ContactsPage implements OnInit, ViewWillEnter {
  private contactoService = inject(ContactoService);
  private userStorage = inject(UserStorageService);
  searchTerm: string = '';

  usuarioLogueado!: any;
  contactos!: Contacto[];
  contactosPendientes: Contacto[] = [];
  contactosAAceptar: Contacto[] = [];

  constructor(
    private router: Router,
    private modalCtrl: ModalController
  ) {
    addIcons({
      personAddOutline,
      shareOutline,
      settingsOutline,
      closeOutline,
      timeOutline,
      chevronForwardOutline,
      personOutline,
      checkmarkOutline,
      closeCircleOutline
    });
  }

  async ngOnInit() {
    this.usuarioLogueado = await this.userStorage.getUsuario();
    this.reload();
  }

  ionViewWillEnter() {
    // Este método se ejecuta cada vez que la página va a entrar en vista
    // incluyendo cuando regresas desde otra página
    if (this.usuarioLogueado) {
      this.reload();
    }
  }

  reload() {
    this.cargarContactos();
    this.cargarContactospendientes();
    this.cargarContactosAAceptar();
  }


  cargarContactos() {
    if (!this.usuarioLogueado?.id) return;

    this.contactoService.getAllActive(this.usuarioLogueado.id).subscribe({
      next: (data: any) => {
        this.contactos = data || [];
      },
      error: (err) => {
        console.error('Error al cargar contactos:', err);
        this.contactos = [];
      }
    });
  }

  cargarContactospendientes() {
    if (!this.usuarioLogueado?.id) return;

    this.contactoService.getAllPending(this.usuarioLogueado.id).subscribe({
      next: (data: any) => {
        this.contactosPendientes = data || [];
      },
      error: (err) => {
        console.error('Error al cargar contactos pendientes:', err);
        this.contactosPendientes = [];
      }
    });
  }
  cargarContactosAAceptar() {
    if (!this.usuarioLogueado?.id) return;

    this.contactoService.getAllReceivedPending(this.usuarioLogueado.id).subscribe({
      next: (data: any) => {
        this.contactosAAceptar = data || [];
      },
      error: (err) => {
        console.error('Error al cargar contactos a aceptar:', err);
        this.contactosAAceptar = [];
      }
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
  }

  addContact() {
    this.router.navigate(['/add-contact']);
  }

  toggleContact(contacto: Contacto) {
    this.contactoService.toogleActivo(contacto.id.toString(), contacto.activo).subscribe({
      next: (data) => {
        console.log('Contacto actualizado:', data);
        contacto.activo = !contacto.activo;
      }
    });
  }

  cancelSentInvitation(contactId: number) {
    this.contactoService.cancelarSolicitud(contactId, this.usuarioLogueado.id).pipe(
      finalize(() => {
        this.cargarContactospendientes();
      })
    ).subscribe({
      next: (data) => {
        console.log('invitacion cancelada:', data);
        // Actualizar la lista local
        this.contactosAAceptar = this.contactosAAceptar.filter(c => c.id !== contactId);
      },
      error: (err) => {
        console.error('Error al cancelar invitación:', err);
      }
    });
  }

  acceptPendingContact(contactId: number) {
    this.contactoService.responderSolicitud(contactId, 'A', this.usuarioLogueado.id).pipe(
      finalize(() => {
        this.reload();
      })
    ).subscribe({
      next: (data) => {
        console.log('Contacto aceptado:', data);
        // Actualizar la lista local
        this.contactosAAceptar = this.contactosAAceptar.filter(c => c.id !== contactId);
      },
      error: (err) => {
        console.error('Error al aceptar contacto:', err);
      }
    });
  }

  rejectPendingContact(contactId: number) {
    this.contactoService.responderSolicitud(contactId, 'R', this.usuarioLogueado.id).pipe(
      finalize(() => {
        this.cargarContactosAAceptar();
      })
    ).subscribe({
      next: (data) => {
        console.log('Contacto rechazado:', data);
        // Actualizar la lista local
        this.contactosAAceptar = this.contactosAAceptar.filter(c => c.id !== contactId);
      },
      error: (err) => {
        console.error('Error al rechazar contacto:', err);
      }
    });
  }

  async shareInvitationLink() {
    try {
      const modal = await this.modalCtrl.create({
        component: ShareLinkModalComponent,
        componentProps: {
          shareLink: 'https://alertapersona.com/invitacion/user_' + Math.random().toString(36).substr(2, 9),
          title: 'Compartir invitación'
        },
        breakpoints: [0, 0.6, 0.9],
        initialBreakpoint: 0.9,
        backdropDismiss: true
      });

      await modal.present();
    } catch (error) {
      console.error('Error abriendo modal:', error);
    }
  }

  openSecuritySettings() {
    console.log('Abrir configuración de seguridad');
  }

  get filteredContacts() {
    if (!this.contactos || !Array.isArray(this.contactos)) return [];
    if (!this.searchTerm) return this.contactos;

    return this.contactos.filter(contacto => {
      const nombreCompleto = this.getNombreCompleto_contactoUsuario(contacto);
      return nombreCompleto.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  get pendingCount() {
    return this.contactosPendientes?.length || 0;
  }
  get toAcceptCount() {
    return this.contactosAAceptar?.length || 0;
  }

  getNombreCompleto_contactoUsuario(contacto: Contacto): string {
    return `${contacto.contactoUsuario?.nombre} ${contacto.contactoUsuario?.apellido}`;
  }
  getNombreCompleto_usuario(contacto: Contacto): string {
    return `${contacto.usuario?.nombre} ${contacto.usuario?.apellido}`;
  }

  getEstadoText(estado: EstadoContacto, seccion: string): string {
    switch (estado) {
      case EstadoContacto.PENDIENTE:
        if (seccion === 'pendientes') {
          return 'Invitación enviada • En espera de aceptación';
        } else if (seccion === 'aAceptar') {
          return 'Invitación recibida • Requiere tu respuesta';
        }
        return 'Invitación enviada • En espera de aceptación';
      case EstadoContacto.ACEPTADA:
        return 'Contacto aceptado';
      case EstadoContacto.RECHAZADA:
        return 'Invitación rechazada';
      default:
        return 'Estado desconocido';
    }
  }

  // Funciones trackBy para optimizar el renderizado de listas
  trackByContactoId(index: number, contacto: Contacto): any {
    return contacto.id;
  }

  trackByPendienteId(index: number, pendiente: Contacto): any {
    return pendiente.id;
  }

  handleRefresh(event: any) {
    this.reload();
    event.target.complete();
  }
}

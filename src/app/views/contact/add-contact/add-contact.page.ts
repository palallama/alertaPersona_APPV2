import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  IonSpinner,
  IonText,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  searchOutline,
  personAddOutline,
  mailOutline,
  callOutline,
  arrowBackOutline,
  personOutline
} from 'ionicons/icons';
import { Usuario, UsuarioLogueado } from 'src/app/core/interfaces/usuario';
import { ContactoService } from 'src/app/core/services/contacto';
import { UserStorageService } from 'src/app/core/services/user-storage';
import { AlertService } from 'src/app/components/alerta/alerta.service';

interface UsuarioEncontrado extends Usuario {
  esContacto?: boolean;
}

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
  standalone: true,
  imports: [IonBadge, 
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
    IonSpinner,
    IonText,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    CommonModule, 
    FormsModule
  ]
})
export class AddContactPage implements OnInit {
  private contactoService = inject(ContactoService);
  private userStorage = inject(UserStorageService);
  private alerts = inject(AlertService);

  usuarioLogeado!:UsuarioLogueado|null;

  search: string = '';
  searching: boolean = false;
  usuariosEncontrados: UsuarioEncontrado[] = [];
  mostrarResultados: boolean = false;
  noResultados: boolean = false;

  constructor(private router: Router) {
    addIcons({
      searchOutline,
      personAddOutline,
      mailOutline,
      callOutline,
      arrowBackOutline,
      personOutline
    });
  }

  async ngOnInit() {
    this.usuarioLogeado = await this.userStorage.getUsuario()!;
  }

  onSearchChange(event: any) {
    this.search = event.detail.value;
    
    if (this.search.length >= 3) {
      this.buscarUsuarios();
    } else {
      this.mostrarResultados = false;
      this.usuariosEncontrados = [];
      this.noResultados = false;
    }
  }

  buscarUsuarios() {
    this.searching = true;
    this.mostrarResultados = false;

    this.contactoService.buscarUsuarios(this.usuarioLogeado!.id, this.search).subscribe({
      next: (res: any) => {
        this.usuariosEncontrados = res.map((usuario: UsuarioEncontrado) => ({
          ...usuario,
          mostrarInvitar: !usuario.esContacto
        }));
        this.searching = false;
        this.mostrarResultados = true;
        this.noResultados = this.usuariosEncontrados.length === 0;
      },
      error: (err) => {
        console.error('Error al buscar usuarios:', err);
        this.searching = false;
        this.mostrarResultados = true;
        this.noResultados = true;
      }
    });
    
    // Simular llamada a API con delay
    // setTimeout(() => {
    //   const termino = this.search.toLowerCase();
      
    //   const resultados = this.usuariosSimulados.filter(usuario => 
    //     usuario.nombre.toLowerCase().includes(termino) ||
    //     usuario.apellido.toLowerCase().includes(termino) ||
    //     usuario.mail.toLowerCase().includes(termino) ||
    //     usuario.telefono.includes(termino) ||
    //     usuario.nroDocumento.toString().includes(termino) ||
    //     usuario.id?.toLowerCase().includes(termino)
    //   );

    //   this.usuariosEncontrados = resultados;
    //   this.searching = false;
    //   this.mostrarResultados = true;
    //   this.noResultados = resultados.length === 0;
    // }, 1000);
  }

  agregarContacto(usuario: UsuarioEncontrado) {
    console.log('Agregando contacto:', usuario);

    this.contactoService.create(this.usuarioLogeado!.id, usuario.id!).subscribe({
      next: (res) => {
        // alert(`Solicitud de contacto enviada a: ${this.getNombreCompleto(usuario)}`);
        this.router.navigate(['/contacts']);
      },
      error: (err) => {
        console.error('Error al enviar solicitud de contacto:', err);
        alert('Error al enviar la solicitud de contacto. Intente nuevamente.');
      }
    });

  }

  async invitarUsuario() {

    this.contactoService.enviarInvitacion(this.usuarioLogeado!.id, this.search).subscribe({
      next: async (res) => {
        let message = `Se ha enviado una invitación a: ${this.search}`;
        console.log(message);
        await this.alerts.showAlert({
          title: 'Invitación enviada',
          message: message,
          buttons: [
            { 
              text: 'Aceptar', 
              role: 'confirm',
            }
          ]
        });
        this.router.navigate(['/contacts']);
      },
      error: async (err) => {
        let message = 'Error al enviar la invitación. Intente nuevamente.';
        console.error(message, err);
        console.log(err);
        console.log(err.error);
        message = err.error?.message || message;
        await this.alerts.showAlert({
          title: 'Error',
          message: message,
          buttons: [
            { 
              text: 'Aceptar', 
              role: 'confirm',
            }
          ]
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/contacts']);
  }

  getNombreCompleto(usuario: Usuario): string {
    return `${usuario.nombre} ${usuario.apellido}`;
  }

  isEmail(term: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(term);
  }

  isPhoneNumber(term: string): boolean {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(term);
  }
}

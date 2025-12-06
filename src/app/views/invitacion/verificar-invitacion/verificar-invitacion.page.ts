import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSpinner, IonIcon, IonText, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactoService } from 'src/app/core/services/contacto';
import { AlertService } from 'src/app/components/alerta/alerta.service';
import { GeneralButton } from 'src/app/components/buttons/general-button/general-button';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline, timeOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth';
import { UserStorageService } from 'src/app/core/services/user-storage';
import { StorageService } from 'src/app/core/services/storage.service';
import { StorageKeys } from 'src/app/core/interfaces/storage';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-verificar-invitacion',
  templateUrl: './verificar-invitacion.page.html',
  styleUrls: ['./verificar-invitacion.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonText,
    IonIcon,
    IonSpinner,
    IonContent,
    CommonModule,
    FormsModule,
    GeneralButton
  ]
})
export class VerificarInvitacionPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contactoService = inject(ContactoService);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private userStorage = inject(UserStorageService);
  private storageService = inject(StorageService);

  codigo: string = '';
  verificando: boolean = true;
  resultado?: any;
  usuarioLogueado: any = null;

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      closeCircleOutline,
      timeOutline
    });
  }

  async ngOnInit() {
    // Verificar si hay sesión activa
    this.usuarioLogueado = await this.userStorage.getUsuario();
    
    // Obtener el código de invitación desde la URL
    this.route.params.subscribe(params => {
      this.codigo = params['codigo'];
      if (this.codigo) {
        this.verificarCodigo();
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  verificarCodigo() {
    this.verificando = true;
    this.contactoService.validarCodigoInvitacion(this.codigo).subscribe({
      next: async (response: any) => {
        // La respuesta es la invitación directamente
        // Estado "P" = Pendiente (válida), otros estados = inválida
        const esValida = response.estado === 'P';
        
        this.resultado = {
          valida: esValida,
          mensaje: esValida ? response.mensaje : 'La invitación no está disponible',
          invitacion: response,
          invitador: response.usuario
        };
        this.verificando = false;
        
        // Si es válida
        if (this.resultado.valida) {
          // Caso 1: Usuario con sesión activa - aceptar invitación directamente
          if (this.usuarioLogueado && this.usuarioLogueado.id) {
            await this.aceptarInvitacionDirecta();
          } 
          // Caso 2: Usuario sin sesión - redirigir al login/registro
          else {
            setTimeout(() => {
              this.irALoginORegistro();
            }, 2000);
          }
        }
      },
      error: (error) => {
        console.error('Error al verificar invitación:', error);
        this.verificando = false;
        this.resultado = {
          valida: false,
          mensaje: error.error?.mensaje || 'Error al verificar la invitación. Por favor, intenta nuevamente.'
        };
        this.alertService.showAlert({
          title: 'Error',
          message: 'No se pudo verificar la invitación. Por favor, intenta nuevamente.'
        });
      }
    });
  }

  async aceptarInvitacionDirecta() {
    try {
      await firstValueFrom(this.contactoService.aceptarInvitacion(this.codigo, this.usuarioLogueado.id.toString()));
      
      this.alertService.showAlert({
        title: '¡Invitación aceptada!',
        message: `Ahora ${this.resultado.invitador.nombre} ${this.resultado.invitador.apellido} es tu contacto.`
      });
      
      // Redirigir a la vista de contactos después de 2 segundos
      setTimeout(() => {
        this.router.navigateByUrl('/contacts');
      }, 2000);
    } catch (error) {
      console.error('Error al aceptar invitación:', error);
      this.alertService.showAlert({
        title: 'Error',
        message: 'No se pudo aceptar la invitación. Por favor, intenta nuevamente.'
      });
    }
  }

  async irALoginORegistro() {
    // Guardar código en storage para mantenerlo durante todo el flujo
    await this.storageService.set(StorageKeys.CODIGO_INVITACION, this.codigo);
    this.router.navigate(['/login']);
  }

  irARegistro() {
    this.router.navigate(['/sing-in'], {
      queryParams: { codigo: this.codigo }
    });
  }

  volverAlLogin() {
    this.router.navigateByUrl('/login');
  }
}

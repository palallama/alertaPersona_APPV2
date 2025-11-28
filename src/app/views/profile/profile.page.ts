import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  logOutOutline, trashOutline, banOutline
} from 'ionicons/icons';
import { FooterComponent } from '../../components/footer/footer.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { Usuario } from 'src/app/core/interfaces/usuario';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { firstValueFrom } from 'rxjs';
import { PadZeroPipe } from 'src/app/core/pipes/pad-zero.pipe';
import { UserStorageService } from 'src/app/core/services/user-storage';
import { AlertService } from 'src/app/components/alerta/alerta.service';
import { AuthService } from 'src/app/core/services/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonMenuButton,
    CommonModule,
    FormsModule,
    FooterComponent,
    PersonalInfoComponent,
    PreferencesComponent,
    PadZeroPipe,
  ]
})
export class ProfilePage implements OnInit {
  private usuarioService = inject(UsuarioService);
  private userStorage = inject(UserStorageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alerts = inject(AlertService);

  usuario: Usuario | null = null;

  constructor() {
    addIcons({ banOutline, trashOutline, logOutOutline, cameraOutline });
  }

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  async cargarUsuarioActual() {
    try {
      const usuarioLogueado = await this.userStorage.getUsuario();
      if (usuarioLogueado && usuarioLogueado.id) {
        // Cargar datos completos del usuario
        const usuarioCompleto = await firstValueFrom(this.usuarioService.getUsuario(usuarioLogueado.id)) as Usuario;
        if (usuarioCompleto) {
          this.usuario = usuarioCompleto;
        }
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  }

  onUsuarioUpdated(usuarioActualizado: Usuario) {
    this.usuario = usuarioActualizado;
    console.log('Usuario actualizado en el componente padre:', usuarioActualizado);
  }


  async usuarioDisabledConfirm() {
    await this.alerts.showAlert({
      title: 'Seguro que desea desactivar su cuenta?',
      message: 'Una vez desactivada, no podra iniciar sesion hasta que un administrador la reactive.',
      buttons: [
        { 
          text: 'Cancelar', 
          role: 'cancel',
          handler: () => {
            console.log('El usuario canceló');
            return true; // Cierra el alerta
          }
        },
        { 
          text: 'Aceptar', 
          role: 'confirm',
          handler: () => {  
            this.onUsuarioDisabled();
            return true; // Cierra el alerta
          }
        }
      ]
    });
  }
  onUsuarioDisabled() {
    if (this.usuario) {
      this.usuario.activo = false;
      
      this.usuarioService.desactivarUsuario(this.usuario.id!).subscribe({
        next: () => {
          console.log('Usuario desactivado correctamente');
          this.usuario = null;
          this.authService.cerrarSesion();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error desactivando usuario:', error);
        }
      });
    }
  }
  
  async usuarioDeletedConfirm() {
    const resultado = await this.alerts.showInputAlert({
      title: 'Seguro que desea eliminar su cuenta?',
      message: 'Ingrese razon por la cual desea eliminar su cuenta:',
      inputType: 'text',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: (valor) => {
            // if (!valor) {
            //   console.log('El campo no puede estar vacío');
            //   return false; // Evita que se cierre
            // }
            return true; // Permite que se cierre
          }
        }
      ]
    });

    // Verificar el resultado
    if (resultado?.role === 'confirm') {
      console.log('Valor ingresado:', resultado.value);
      this.onUsuarioDisabled();
    } else {
      console.log('El usuario canceló la operación');
    }
  }
  onUsuarioDeleted() {
    if (this.usuario) {
      this.usuario.activo = false;
      
      this.usuarioService.deleteUsuario(this.usuario.id!).subscribe({
        next: () => {
          console.log('Usuario eliminado correctamente');
          this.usuario = null;
          this.authService.cerrarSesion();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error eliminando usuario:', error);
        }
      });
    }
  }

}

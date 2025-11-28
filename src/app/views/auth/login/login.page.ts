import { Component, inject, OnInit } from '@angular/core';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonImg } from "@ionic/angular/standalone";
import { NotificacionService } from 'src/app/core/services/notificacion.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from 'src/app/components/alerta/alerta.service';
import { StorageKeys } from 'src/app/core/interfaces/storage';
import { PasswordInputComponent } from 'src/app/components/input/password-input/password-input.component';
import { TextInputComponent } from 'src/app/components/input/text-input/text-input.component';
import { appLogo, appName } from 'src/app/core/constants';
import { AuthService } from 'src/app/core/services/auth';
import { GeneralButton } from "src/app/components/buttons/general-button/general-button";
import { UserStorageService } from 'src/app/core/services/user-storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonImg,
    RouterLink,
    TextInputComponent,
    PasswordInputComponent,
    GeneralButton
],
  providers: []
})
export class LoginPage implements ViewWillEnter, ViewWillLeave, OnInit{
  private notificacionService = inject(NotificacionService);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private userStorage = inject(UserStorageService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private alerts = inject(AlertService);
  appLogo = appLogo;
  appName = appName;

  usuario = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.email, Validators.minLength(10)]),
    password: new FormControl('', [Validators.required])
  });

  ngOnInit(){
    this.resetForm()
    this.checkUsuario()
    
  }
  ionViewWillEnter() {
    this.resetForm()
    this.checkUsuario()
  }

  ionViewWillLeave() {
    // Quitar el foco de cualquier elemento activo para evitar el warning de aria-hidden
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  resetForm(){
    this.usuario.reset({mail: "", password: ""})
    this.storageService.remove(StorageKeys.TOKEN_NOTIFICACION);
  }
  async checkUsuario(){
    if ( await this.userStorage.getUsuario() !== undefined ){
      this.router.navigateByUrl("/")
    }
  }

  async enter(){

    if (this.usuario.valid){
      this.authService.iniciarSesion(this.usuario.value.mail!, this.usuario.value.password!).subscribe({
        next: (res:any) => {
          this.storageService.set(StorageKeys.TOKEN, res.access_token);
          // this.storageService.set(StorageKeys.TOKEN, "test");
          this.setTokenNotificacion();
          this.router.navigateByUrl("/");
        },
        error: (error:any) => {
          console.log(error)
          this.mostrarError(error);
        }
      })

    }
  }

  private async setTokenNotificacion(){
    await this.notificacionService.iniciarNotificaciones();
    const notiToken = await this.storageService.get(StorageKeys.TOKEN_NOTIFICACION);
    if (notiToken){
      let usr = await this.userStorage.getUsuario();
      console.log("setNotificacionToken", usr, notiToken)
      this.usuarioService.setNotificacionToken(usr!.id, notiToken).subscribe();
    }
  }

  mostrarError(error:any) {
    console.error('Error en el inicio de sesión:', error);
    let message = 'Error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.';
    if (error.status === 401) {
      message = 'Credenciales incorrectas. Por favor, verifique su correo electrónico y contraseña.';
    }
    this.alerts.showAlert({
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
}

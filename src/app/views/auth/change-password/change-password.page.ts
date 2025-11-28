import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { PasswordInputComponent } from 'src/app/components/input/password-input/password-input.component';
import { StorageService } from 'src/app/core/services/storage.service';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { StorageKeys } from 'src/app/core/interfaces/storage';
import { appLogo, appName } from 'src/app/core/constants';
import { GeneralButton } from "src/app/components/buttons/general-button/general-button";
import { AuthService } from 'src/app/core/services/auth';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    PasswordInputComponent,
    IonButtons,
    IonBackButton,
    GeneralButton
  ]
})
export class ChangePasswordPage implements OnInit {
  private storageService = inject(StorageService);
  private router = inject(Router);
  private authService = inject(AuthService);
  appLogo = appLogo;
  appName = appName;

  origen: string = "";
  
  mailRecu!:string;
  password = new FormControl("", [ Validators.required ])
  repitePassword = new FormControl("", [ Validators.required ])
  oldPassword = new FormControl("", [ Validators.required ])

  async ngOnInit(){
    this.origen = this.router.parseUrl(this.router.url).queryParams['origen'];
    this.mailRecu = await this.storageService.get(StorageKeys.MAIL_RECUPERO);
    // console.log(this.origen);
  }

  async enter() {

    if ((this.password.valid && this.repitePassword.valid) && ((this.password.value === this.repitePassword.value)) ) {

      console.log(this.password.value);
      console.log(this.repitePassword.value);
      console.log(this.origen);
      
      if (this.origen === 'C'){
        if (this.oldPassword.valid) {
          if (this.password.value !== this.oldPassword.value) {
  
            this.authService.cambiarContrasena(this.password.value!, this.oldPassword.value! ).subscribe({
              error: (err:any) => {
                console.error(err);
                // this.router.navigateByUrl('/configuracion?ok=false');
              },
              complete: ()=>{
                this.router.navigateByUrl('/configuracion?ok=true');
              }
            })
          }

        }
      }else{
        this.authService.resetearContrasena(this.mailRecu, this.password.value!).subscribe({
          error: (err:any) => {
            console.error(err);
          },
          complete: ()=>{
            this.router.navigateByUrl('/login');
          }
        })
      }
      

    }

  }

}

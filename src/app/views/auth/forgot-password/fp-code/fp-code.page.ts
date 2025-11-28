import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { IonContent, IonInputOtp, IonImg } from '@ionic/angular/standalone';
import { GeneralButton } from "src/app/components/buttons/general-button/general-button";
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { StorageKeys } from 'src/app/core/interfaces/storage';
import { appLogo, appName } from 'src/app/core/constants';
import { AuthService } from 'src/app/core/services/auth';

function otpRequiredLength(length: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value.toString().length !== length) {
      return { otpLength: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-fp-code',
  templateUrl: './fp-code.page.html',
  styleUrls: ['./fp-code.page.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonContent,
    CommonModule,
    FormsModule,
    GeneralButton,
    IonInputOtp,
    ReactiveFormsModule,
  ]
})
export class FpCodePage implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  appLogo = appLogo;
  appName = appName;

  mail!:string;
  form = new FormGroup({
    code: new FormControl('', [otpRequiredLength(6)])
  });


  ngOnInit(): void {
    this.mail = this.router.parseUrl(this.router.url).queryParams['mail'];
  }

  async enter() {
    const codigo = this.form.get('code')?.value;
    // console.log(codigo);
    if ( this.form.valid ) {
      this.authService.verificarCodigoPassword(this.mail, codigo!).subscribe({
        error: (err:any) => {
          this.codigoErroneo();
        },
        complete: () => {
          this.storageService.set(StorageKeys.CODIGO_RECUPERO, codigo!);
          this.storageService.set(StorageKeys.MAIL_RECUPERO, this.mail);
          this.router.navigateByUrl("/change-password");
        },
      });
    }


  }

  codigoErroneo(){
    console.log("codigo erroneo");
  }

  reeviar(){

  }
}

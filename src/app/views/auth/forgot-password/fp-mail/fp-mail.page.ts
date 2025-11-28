import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg } from '@ionic/angular/standalone';
import { GeneralButton } from "src/app/components/buttons/general-button/general-button";
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Router, RouterLink } from '@angular/router';
import { TextInputComponent } from 'src/app/components/input/text-input/text-input.component';
import { appLogo, appName } from 'src/app/core/constants';
import { AuthService } from 'src/app/core/services/auth';

@Component({
  selector: 'app-fp-mail',
  templateUrl: './fp-mail.page.html',
  styleUrls: ['./fp-mail.page.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonContent,
    CommonModule,
    RouterLink,
    FormsModule,
    GeneralButton,
    TextInputComponent,
    ReactiveFormsModule,
  ]
})
export class FpMailPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  mail = new FormControl("", [ Validators.required, Validators.email ]);
  appLogo = appLogo;
  appName = appName;

  enter() {
    if ( this.mail.valid ) {
      this.authService.forgotPassword(this.mail.value!).subscribe({
        complete: () => {
          this.router.navigateByUrl(`fp-code?mail=${this.mail.value!}`)
        }
      });
    }
  }

}

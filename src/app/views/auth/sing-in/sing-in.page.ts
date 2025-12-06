import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonImg, IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';
import { TextInputComponent } from 'src/app/components/input/text-input/text-input.component';
import { PasswordInputComponent } from 'src/app/components/input/password-input/password-input.component';
import { GeneralButton } from 'src/app/components/buttons/general-button/general-button';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/components/alerta/alerta.service';
import { Usuario } from 'src/app/core/interfaces/usuario';
import { SelectInputComponent } from 'src/app/components/input/select-input/select-input.component';
import { appLogo, appName } from 'src/app/core/constants';
import { ContactoService } from 'src/app/core/services/contacto';
import { StorageService } from 'src/app/core/services/storage.service';
import { StorageKeys } from 'src/app/core/interfaces/storage';

@Component({
  selector: 'app-sing-in',
  templateUrl: './sing-in.page.html',
  styleUrls: ['./sing-in.page.scss'],
  standalone: true,
  imports: [
    IonRow,
    IonCol,
    IonGrid,
    IonContent,
    CommonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    IonImg,
    TextInputComponent,
    PasswordInputComponent,
    GeneralButton,
    SelectInputComponent
  ],
})
export class SingInPage implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alerts = inject(AlertService);
  private contactoService = inject(ContactoService);
  private storageService = inject(StorageService);
  appLogo = appLogo;
  appName = appName;

  codigoInvitacion: string | null = null;
  usuario!: Usuario;
  usuarioNuevo = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    nroDocumento: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    nroTramite: new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    genero: new FormControl('', [Validators.required]),
    fchNacimiento: new FormControl(null, [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordRepetida: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  generos = [
    { id: 'M', nombre: 'Masculino' },
    { id: 'F', nombre: 'Femenino' },
    { id: 'X', nombre: 'X' }
  ];

  async ngOnInit() {
    // Intentar obtener código de storage primero
    const codigoStorage = await this.storageService.get(StorageKeys.CODIGO_INVITACION);
    
    // Capturar el código de invitación de los query params o storage
    this.route.queryParams.subscribe(params => {
      this.codigoInvitacion = params['codigo'] || codigoStorage || null;
      console.log('Código de invitación:', this.codigoInvitacion);
    });
  }

  registro() {
    console.log(this.usuarioNuevo);
    console.log(this.usuarioNuevo.valid);

    console.log(this.usuarioNuevo.value.genero)

    if (this.usuarioNuevo.valid && (this.usuarioNuevo.value.password === this.usuarioNuevo.value.passwordRepetida)) {
      console.log(" *** Registrado");
      // this.usuario = {
      //   nombre: this.usuarioNuevo.value.nombre!,
      //   apellido: this.usuarioNuevo.value.apellido!,
      //   nroDocumento: this.usuarioNuevo.value.nroDocumento!,
      //   telefono: this.usuarioNuevo.value.telefono!,
      //   nroTramite: this.usuarioNuevo.value.nroTramite!,
      //   mail: this.usuarioNuevo.value.mail!,
      //   password: this.usuarioNuevo.value.password!,
      //   genero: this.usuarioNuevo.value.genero!,
      //   fchNacimiento: this.usuarioNuevo.value.fchNacimiento!
      // }

      // this.usuarioService.insertUsuario(this.usuario).subscribe({
      //   next: (res: any) => {
      //     console.log(res);
      //     console.log("usuario registrado");
      //     this.router.navigateByUrl("/login");
      //   },
      //   error: (err: any) => {
      //     console.log(err);
      //     this.definirError(err);
      //   }
      // })

      this.usuario = {
        nombre: this.usuarioNuevo.value.nombre!,
        apellido: this.usuarioNuevo.value.apellido!,
        nroDocumento: this.usuarioNuevo.value.nroDocumento!,
        telefono: this.usuarioNuevo.value.telefono!,
        nroTramite: this.usuarioNuevo.value.nroTramite!,
        mail: this.usuarioNuevo.value.mail!,
        password: this.usuarioNuevo.value.password!,
        genero: this.usuarioNuevo.value.genero!,
        fchNacimiento: this.usuarioNuevo.value.fchNacimiento!
      }

      this.usuarioService.insertUsuario(this.usuario).subscribe({
        next: (res: any) => {
          console.log(res);
          console.log("usuario registrado");

          // Si hay código de invitación, aceptarla después del registro exitoso
          if (this.codigoInvitacion && res.id) {
            this.aceptarInvitacion(res.id);
          } else {
            this.router.navigateByUrl("/login");
          }
        },
        error: (err: any) => {
          console.log(err);
          this.definirError(err);
        }
      })
      //   next: (res: any) => {
      //     console.log(res);
      //     console.log("usuario registrado");
      //     this.router.navigateByUrl("/login");
      //   },
      //   error: (err: any) => {
      //     console.log(err);
      //     this.definirError(err);
      //   }
      // })


    } else {
      this.definirError();
    }
  }

  async aceptarInvitacion(usuarioId: string) {
    if (!this.codigoInvitacion) {
      this.router.navigateByUrl("/login");
      return;
    }

    this.contactoService.aceptarInvitacion(this.codigoInvitacion, usuarioId).subscribe({
      next: async (response) => {
        console.log('Invitación aceptada exitosamente:', response);
        // Limpiar el código de storage
        await this.storageService.remove(StorageKeys.CODIGO_INVITACION);
        
        this.alerts.showAlert({
          title: '¡Bienvenido!',
          message: 'Tu registro fue exitoso y la invitación fue aceptada. Ya puedes iniciar sesión.'
        });
        this.router.navigateByUrl("/login");
      },
      error: async (error) => {
        console.error('Error al aceptar invitación:', error);
        // Limpiar el código de storage incluso si falla
        await this.storageService.remove(StorageKeys.CODIGO_INVITACION);
        
        this.alerts.showAlert({
          title: 'Registro exitoso',
          message: 'Tu registro fue exitoso, pero hubo un problema al aceptar la invitación. Por favor, contacta con soporte.'
        });
        this.router.navigateByUrl("/login");
      }
    });
  }

  mostrarError(message: string = 'Ocurrio un error') {
    console.log(message);
    this.alerts.showAlert({
      title: 'Error',
      message: message
    });
  }

  definirError(error: any = undefined) {
    let errorMessage = 'Error al registrar usuario. Por favor, inténtelo de nuevo más tarde.';

    (this.usuarioNuevo.value.password === this.usuarioNuevo.value.passwordRepetida) ? '' : errorMessage = 'Las contraseñas no coinciden.\n';

    if (this.usuarioNuevo.invalid) {
      this.usuarioNuevo.controls.mail.hasError('email') ? errorMessage = 'El correo electrónico no es válido.\n' : '';

      this.usuarioNuevo.controls.nroDocumento.hasError('minlength') ? errorMessage = 'El Número de Documento debe tener 8 caracteres.\n' : '';
      this.usuarioNuevo.controls.nroTramite.hasError('minlength') ? errorMessage = 'El Número de Trámite debe tener 11 caracteres.\n' : '';
      this.usuarioNuevo.controls.passwordRepetida.hasError('minlength') ? errorMessage = 'La contraseña debe tener al menos 8 caracteres.\n' : '';
      this.usuarioNuevo.controls.password.hasError('minlength') ? errorMessage = 'La contraseña debe tener al menos 8 caracteres.\n' : '';

      this.usuarioNuevo.controls.passwordRepetida.hasError('required') ? errorMessage = 'La repetición de la contraseña es obligatoria.\n' : '';
      this.usuarioNuevo.controls.password.hasError('required') ? errorMessage = 'La contraseña es obligatoria.\n' : '';
      this.usuarioNuevo.controls.genero.hasError('required') ? errorMessage = 'El género es obligatorio.\n' : '';
      this.usuarioNuevo.controls.mail.hasError('required') ? errorMessage = 'El correo electrónico es obligatorio.\n' : '';
      this.usuarioNuevo.controls.telefono.hasError('required') ? errorMessage = 'El teléfono es obligatorio.\n' : '';
      this.usuarioNuevo.controls.fchNacimiento.hasError('required') ? errorMessage = 'La fecha de nacimiento es obligatoria.\n' : '';
      this.usuarioNuevo.controls.nroTramite.hasError('required') ? errorMessage = 'El Número de Trámite es obligatorio.\n' : '';
      this.usuarioNuevo.controls.nroDocumento.hasError('required') ? errorMessage = 'El Número de Documento es obligatorio.\n' : '';
      this.usuarioNuevo.controls.apellido.hasError('required') ? errorMessage + 'El apellido es obligatorio.\n' : '';
      this.usuarioNuevo.controls.nombre.hasError('required') ? errorMessage = 'El nombre es obligatorio.\n' : '';
    }

    if (error) {
      errorMessage = error.error?.message[0] || errorMessage;
    }

    console.log(errorMessage);
    this.mostrarError(errorMessage);
  }

}


import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';
import { Usuario } from 'src/app/core/interfaces/usuario';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { fechaNacimientoDisplay, formatDateForInput, formatDateFromInput } from 'src/app/utils/datetime-utils';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonIcon,
    IonInput,
    IonItem
  ]
})
export class PersonalInfoComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  fechaNacimientoDisplay = fechaNacimientoDisplay;

  @Input() usuario: Usuario | null = null;
  @Output() usuarioUpdated = new EventEmitter<Usuario>();

  personalForm: FormGroup;
  isEditing = false;

  constructor() {
    addIcons({ createOutline });

    this.personalForm = this.fb.group({
      nombre: [{ value: '', disabled: true }, [Validators.required]],
      apellido: [{ value: '', disabled: true }, [Validators.required]],
      telefono: ['', [Validators.required]],
      mail: ['', [Validators.required, Validators.email]],
      nroDocumento: [{ value: '', disabled: true }, [Validators.required]],
      nroTramite: [{ value: '', disabled: true }, [Validators.required]],
      genero: [{ value: '', disabled: true }, [Validators.required]],
      fchNacimiento: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.usuario) {
      this.actualizarFormulario();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['usuario'] && this.usuario) {
      this.actualizarFormulario();
    }
  }

  private actualizarFormulario() {
    if (this.usuario) {
      const fechaFormateada = formatDateForInput(this.usuario.fchNacimiento);
      
      this.personalForm.patchValue({
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        telefono: this.usuario.telefono,
        mail: this.usuario.mail,
        nroDocumento: this.usuario.nroDocumento,
        nroTramite: this.usuario.nroTramite,
        genero: this.usuario.genero,
        fchNacimiento: fechaFormateada
      });
    }
  }

  onToggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Si se cancela la edición, restaurar formulario
      this.actualizarFormulario();
    }
  }

  onCancelEdit() {
    this.isEditing = false;
    this.actualizarFormulario();
  }

  async onSaveChanges() {
    if (this.personalForm.valid && this.usuario) {
      try {
        const formValue = this.personalForm.getRawValue();
        
        // Convertir la fecha del input a Date object
        const fechaNacimiento = formatDateFromInput(formValue.fchNacimiento);
        
        const usuarioActualizado: Usuario = {
          ...this.usuario,
          telefono: formValue.telefono,
          mail: formValue.mail,
          fchNacimiento: fechaNacimiento || this.usuario.fchNacimiento
        };

        delete usuarioActualizado.activo
        delete usuarioActualizado.fechaCreacion
        delete usuarioActualizado.ultimoAcceso

        await firstValueFrom(this.usuarioService.updateUsuario(usuarioActualizado));
        
        this.isEditing = false;
        this.usuarioUpdated.emit(usuarioActualizado);
        
        console.log('Usuario actualizado correctamente');
      } catch (error) {
        console.error('Error guardando usuario:', error);
      }
    }
  }
}

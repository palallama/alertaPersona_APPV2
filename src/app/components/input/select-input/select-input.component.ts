import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, forwardRef, inject } from '@angular/core';
import { SelectControlValueAccessor , NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true
    }
  ]
})
export class SelectInputComponent implements ControlValueAccessor {
  @Input() selectedValue: any = null;
  @Output() selectedValueChange = new EventEmitter<any>(); // Necesario para two-way binding
  
  @Input() options: any[] = [];
  @Input() optionValueField: string = 'value';
  @Input() optionLabelField: string = 'label';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() label: string = '';
  @Input() mostrarAclaracion: boolean = false;
  @Input() aclaracion: string = '';
  @Input() placeholder: string = 'Seleccione una opción';
  @Input() errorMessage: string = 'Este campo es requerido';
  @Input() showError: boolean = false;
  
  @Output() change = new EventEmitter<any>();
  @Output() blur = new EventEmitter<void>();
  
  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(value: any): void {
    this.selectedValue = value;
    this.onChange(value);
    this.onTouched();
    this.change.emit(value);
    this.selectedValueChange.emit(value); // Emitir el cambio para two-way binding
  }

  onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }

  getOptionValue(option: any): any {
    return option[this.optionValueField];
  }

  getOptionLabel(option: any): string {
    return option[this.optionLabelField];
  }
}
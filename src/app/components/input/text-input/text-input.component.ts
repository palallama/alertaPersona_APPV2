import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, forwardRef, inject, Input, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor, AfterViewInit {
  private renderer = inject(Renderer2);

  onChange!: (value?: any) => void;
  onTouch!: (event: any) => void;
  @Input() placeholder = '';
  @Input() inputType: string = 'text';
  @Input() readOnly: boolean = false;
  @Input() disabled: boolean = false;
  
  @Input() largoMaximo: number = 100; 

  @Input() required: boolean = false;
  @Input() label: string = "Label";
  @Input() mostarLabel: boolean = true;
  @Input() aclaracion: string = "";
  @Input() mostrarAclaracion: boolean = false;

  @Input() style: string = "";
  @Input() icono: string = "";

  @Input() error: boolean = false;
  @Input() errorTxt: string = "Campo invalido";

  value: string = '';

  @Input() defaultValue: string = "";

  @ViewChild('input', {static: false}) input!: ElementRef;

  ngAfterViewInit(): void {
    if (this.icono !== ""){
      this.renderer.setStyle(this.input.nativeElement, 'padding-left', '35px');
    }
  }

  writeValue(value: any) {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisableState(status: boolean) {
    this.disabled = status;
  }
  onInput(event: any) {
    if(this.onChange) {
      this.onChange(event.value);
    }
  }
  onTouched(value: any) {
    if(this.onTouch) {
      this.onTouch(value)
    }
  }
  onFocus() {
    this.input.nativeElement.focus();
  }

}

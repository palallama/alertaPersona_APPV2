import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-general-button',
  templateUrl: './general-button.html',
  styleUrls: ['./general-button.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class GeneralButton {
  @Input() label!: string;
  @Input() disabled: boolean = false;
  @Input() style: string = "";
  @Input() class: string = "";
  @Output() botonClick: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    this.botonClick.emit();
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { warning } from 'ionicons/icons';
import { emitirAlerta } from 'src/app/core/common/alerta';
import { LocalizacionService } from 'src/app/core/services/localizacion.service';
import { UN_SEGUNDO } from 'src/app/core/constants/in-milliseconds';
import { appLogo } from 'src/app/core/constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class FooterComponent implements OnInit, OnDestroy {
  
  longPressTimer: any;
  readonly LONG_PRESS_DURATION = UN_SEGUNDO;
  isLongPressing = false;
  buttonState: 'normal' | 'pressing' | 'ready' = 'normal';
  appLogo = appLogo;

  constructor(private router: Router, private localizacionService: LocalizacionService) {
    addIcons({ warning });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.clearTimer();
  }

  onTouchStart(event: TouchEvent) {
    event.preventDefault(); // Prevenir menú contextual
    this.startLongPress();
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault(); // Prevenir menú contextual
    if (event.button === 0) {
      this.startLongPress();
    }
  }

  onTouchEnd(event: TouchEvent) {
    event.preventDefault();
    this.endLongPress();
  }

  onMouseUp(event: MouseEvent) {
    event.preventDefault();
    this.endLongPress();
  }

  onTouchCancel(event: TouchEvent) {
    event.preventDefault();
    this.cancelLongPress();
  }

  onContextMenu(event: Event) {
    event.preventDefault(); // Prevenir menú contextual completamente
    return false;
  }

  private startLongPress() {
    this.isLongPressing = true;
    this.buttonState = 'pressing';
    
    this.longPressTimer = setTimeout(() => {
      this.triggerAlert();
    }, this.LONG_PRESS_DURATION);
    
    // Cambiar a estado "ready" cerca del final
    setTimeout(() => {
      if (this.isLongPressing) {
        this.buttonState = 'ready';
      }
    }, this.LONG_PRESS_DURATION - 200); // 200ms antes de completar
  }

  private endLongPress() {
    if (this.longPressTimer && this.isLongPressing) {
      this.cancelLongPress();
    }
  }

  private cancelLongPress() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.isLongPressing = false;
    this.buttonState = 'normal';
  }

  private clearTimer() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private triggerAlert() {
    this.buttonState = 'normal';
    this.isLongPressing = false;
    this.clearTimer();
    
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    
    emitirAlerta(this.localizacionService, this.router);
  }
}

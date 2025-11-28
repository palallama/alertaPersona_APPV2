import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-elapsed-timer',
  templateUrl: './elapsed-timer.component.html',
  styleUrls: ['./elapsed-timer.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ElapsedTimerComponent implements OnInit, OnDestroy {
  @Input() isActive: boolean = true;
  @Input() customClass: string = '';
  @Input() showSeconds: boolean = true;
  
  elapsedTime: number = 0;
  private timer: any;
  private startTime: number = 0;

  ngOnInit() {
    if (this.isActive) {
      this.startTimer();
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private startTimer() {
    this.startTime = Date.now();
    this.elapsedTime = 0;
    
    this.timer = setInterval(() => {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
    }, 1000);
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getFormattedElapsedTime(): string {
    const minutes = Math.floor(this.elapsedTime / 60);
    const seconds = this.elapsedTime % 60;
    
    if (this.showSeconds) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}m`;
    }
  }

  restart() {
    this.stopTimer();
    if (this.isActive) {
      this.startTimer();
    }
  }

  stop() {
    this.stopTimer();
  }

  start() {
    if (!this.timer) {
      this.startTimer();
    }
  }
}
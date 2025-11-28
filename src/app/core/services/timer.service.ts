import { Injectable } from '@angular/core';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  
  wait(time:number) {
    return timer(time);
  }

}

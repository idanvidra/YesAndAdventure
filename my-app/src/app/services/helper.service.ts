import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  // timeRemainingUntillTimerShown: any;
  // timeRemainingUntillMessageEnd: any;
  // numberOfKeysTyped: any;
  // timerElement: any;
  // isActive: any;
  // intervalUntillTimerShown!: any;
  // intervalUntillMessageEnd!: any;

  constructor(
    private timerElement: any,
    private timeRemainingUntillTimerShown: any,
    private timeRemainingUntillMessageEnd: any,
    private numberOfKeysTyped: any,
    private isActive: any,
    private intervalUntillTimerShown: any,
    private intervalUntillMessageEnd: any) { 
    this.timeRemainingUntillTimerShown = 0;
    this.timeRemainingUntillMessageEnd = 0;
    this.timerElement = timerElement;
    this.numberOfKeysTyped = 0;
    this.isActive = false;
  }

  start = () => {
    if(!this.isActive){
      this.isActive = true;
      this.timeRemainingUntillTimerShown = 15;
      this.updateTimerUntillTimerShown();
      this.intervalUntillTimerShown = setInterval(this.updateTimerUntillTimerShown, 1000);
      this.timerElement.textContent = '';
    }
  }

  updateTimerUntillTimerShown = () => {
    if(this.timeRemainingUntillTimerShown <= 0){
      clearInterval(this.intervalUntillTimerShown);
      this.timeRemainingUntillMessageEnd = 15;
      this.updateTimerUntillMessageEnd();
      this.intervalUntillMessageEnd = setInterval(this.updateTimerUntillMessageEnd, 1000);
      this.timerElement.textContent = String(this.timeRemainingUntillMessageEnd)
    }else{
        this.timeRemainingUntillTimerShown -= 1;
    }
  }

  updateTimerUntillMessageEnd = () => {
    if(this.timeRemainingUntillMessageEnd <= 0){
      clearInterval(this.intervalUntillMessageEnd);
      this.timerElement.textContent = "Time's up, please send the message";
    }else{
        this.timeRemainingUntillMessageEnd -= 1;
        this.timerElement.textContent = String(this.timeRemainingUntillMessageEnd);
    }
  }

  stopTimer = () => {
    this.timeRemainingUntillTimerShown = 0;
    clearInterval(this.intervalUntillTimerShown);
    this.timeRemainingUntillMessageEnd = 0;
    clearInterval(this.intervalUntillMessageEnd);
    this.timerElement.textContent = '';
    this.isActive = false;
  }
}

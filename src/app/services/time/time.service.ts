import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() {
  }

  public changeTimeZone(date: string) {
    const time = new Date(date);
    time.setTime(time.getTime() + 7 * 60 * 60 * 1000)
    return time.toLocaleString();
  }

  public now() {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
  }

}

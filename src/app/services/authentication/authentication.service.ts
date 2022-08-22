import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public static isAuthenticated: boolean = false;

  constructor() {
  }

  getToken() {
    const token: any = localStorage.getItem('userData')
    return JSON.parse(token);
  }

  setToken(token: string) {
    AuthenticationService.isAuthenticated = true;
    localStorage.setItem('userData', token);
  }

  removeToken() {
    AuthenticationService.isAuthenticated = false;
    localStorage.removeItem('userData');
  }

}

import {Injectable} from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {ChatService} from "../services/chat/chat.service";

@Injectable({providedIn: 'root'})
export class AuthenticationGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  canActivate() {
    const token: any = this.authenticationService.getToken();
    if (!token) {
      this.router.navigateByUrl("/login");
      return false;
    }
    return true;
  }
}

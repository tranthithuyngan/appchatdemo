import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {environment} from "../../environments/environment";
import {ChatService} from "../services/chat/chat.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ChatService, AuthenticationService],
})
export class LoginComponent implements OnInit {
  responseLogin = '';
  loginForm = this.fb.group({
    "username": ['', [Validators.required]],
    "password": ['', [Validators.required]],
  });


  constructor(private chatService: ChatService, private authenticationService: AuthenticationService, private router: Router, private fb: FormBuilder) {
    if (this.authenticationService.getToken()) this.router.navigateByUrl('/home')
  }

  ngOnInit(): void {
    this.subscribe();
  }

  subscribe() {
    this.chatService.messages.subscribe(async (message: any) => {
      console.log("Response: ", message)
      if (message.event === environment.event.LOGIN) {
        if (message.status === 'success') {
          await this.handleSuccess(message);
        }
      }
      this.responseLogin = message.mes;
    });
  }

  async handleSuccess(message: any) {
    const token: any = {
      user: this.loginForm.controls.username.value,
      code: message.data.RE_LOGIN_CODE
    }
    await this.authenticationService.setToken(JSON.stringify(token))
    await this.router.navigate(['/home']);
  }


  login() {
    this.chatService.login({
      user: this.loginForm.controls.username.value,
      pass: this.loginForm.controls.password.value
    })
  }

  toggleEye(value : any) {
    if(value == 1){
      // @ts-ignore
      document.querySelector('.eye').previousElementSibling.setAttribute('type','password');
      // @ts-ignore
      let ele = document.querySelector('.eye').children[0].classList.toggle('fa-eye-slash');
      if(ele){
        // @ts-ignore
        document.querySelector('.eye').previousElementSibling.setAttribute('type','text');
      }
    }
  }
}

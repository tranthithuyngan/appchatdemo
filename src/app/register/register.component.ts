import {Component, OnInit} from '@angular/core';
import {ChatService} from "../services/chat/chat.service";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../login/login.component.css']
})
export class RegisterComponent implements OnInit {
  public registerForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    repeatPassword: new FormControl(),
  })


  constructor(private chatService: ChatService, private authenticationService: AuthenticationService, private router: Router) {
    if (authenticationService.getToken()) router.navigateByUrl('/home')
    chatService.messages.subscribe(message => {
      console.log("Response from websocket: ", message);
      const username = document.querySelector('#name') as HTMLInputElement;
      const password = document.querySelector('#password') as HTMLInputElement;
      const re_password = document.querySelector("#repeat-password") as HTMLInputElement;
      const notification_username = document.querySelector('#notification_username') as HTMLDivElement;
      const notification_repass = document.querySelector('#notification_repassword') as HTMLDivElement;
      const notification_pass = document.querySelector('#notification_password') as HTMLDivElement;
      if (username.value !== "") {
        if (message.event === 'REGISTER' && message.status === 'success') {
          router.navigateByUrl('/login');
        } else if (message.mes === 'Creating account error, Duplicate Username') {
          notification_username.innerHTML = 'Account already exists';
          this.checkValidate(password, re_password, notification_pass, notification_repass);
        } else {
          notification_repass.style.display = 'block';
          notification_repass.innerHTML = "Please enter data!";
          notification_username.style.display = 'block';
          notification_username.innerHTML = "Please enter data!";
          notification_pass.style.display = 'block';
          notification_pass.innerHTML = "Please enter data!";
        }
      } else {
        notification_username.innerHTML = "Please enter data!";
        this.checkValidate(password, re_password, notification_pass, notification_repass);
      }
    });
  }

  ngOnInit(): void {
  }

  validate() {

  }

  register() {
    this.chatService.register({
      user: this.registerForm.controls.username.value,
      pass: this.registerForm.controls.password.value,
    })
  }

  checkValidate(password: HTMLInputElement, re_password: HTMLInputElement, notification_pass: HTMLDivElement, notification_repass: HTMLDivElement) {
    if (password.value === "" && re_password.value === "") {
      notification_repass.innerHTML = 'Please enter data!';
      notification_pass.innerHTML = 'Please enter data!';
    } else {
      if (password.value === "" && re_password.value !== "") {
        notification_repass.style.display = 'none';
        notification_pass.innerHTML = 'Please enter data!';
      } else if (password.value !== "" && re_password.value === "") {
        notification_pass.style.display = 'none';
        notification_repass.innerHTML = 'Please enter data!';
      } else if (password.value !== re_password.value) {
        notification_repass.innerHTML = 'Passwords entered are not duplicates';
      } else {
        notification_repass.style.display = 'none';
        notification_pass.style.display = 'none';
      }
    }

  }

  toggleEye(value: any) {
    if (value != -1) {
      // @ts-ignore
      document.querySelector('.eye').previousElementSibling.setAttribute('type', 'password');
      // @ts-ignore
      let pass = document.querySelector('.eye').children[0].classList.toggle('fa-eye-slash');
      if (pass) {
        // @ts-ignore
        document.querySelector('.eye').previousElementSibling.setAttribute('type', 'text');
      }
    } else {
      // @ts-ignore
      document.querySelector('.eye-password__repeat').previousElementSibling.setAttribute('type', 'password');
      // @ts-ignore
      let repeatPass = document.querySelector('.eye-password__repeat').children[0].classList.toggle('fa-eye-slash');
      if (repeatPass) {
        // @ts-ignore
        document.querySelector('.eye-password__repeat').previousElementSibling.setAttribute('type', 'text');
      }
    }
  }
}

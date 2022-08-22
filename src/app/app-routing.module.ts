import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from "./register/register.component";
import {AuthenticationGuard} from "./guards/authentication.guard";

const routes: Routes = [
  {path: 'home', component: HomeComponent, title: 'Chitchat - Home', canActivate: [AuthenticationGuard]},
  {path: 'login', component: LoginComponent, title: 'Chitchat - Login'},
  {path: 'register', component: RegisterComponent, title: 'Chitchat - Signup'},
  {path: '', component: HomeComponent, title: 'Chitchat - Home', canActivate: [AuthenticationGuard]},
  {path: '**', component: LoginComponent, title: 'Chitchat - Login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

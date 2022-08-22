import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {RegisterComponent} from './register/register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WebsocketService} from "./services/websocket/websocket.service";
import {ChatService} from "./services/chat/chat.service";
import {AuthenticationService} from "./services/authentication/authentication.service";
import {BoxChatComponent} from './components/box-chat/box-chat.component';
import {SearchChatComponent} from './components/search-chat/search-chat.component';
import {SearchMessageComponent} from './components/search-message/search-message.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {GroupChatComponent} from './components/group-chat/group-chat.component';
import {ChatBarComponent} from './components/chat-bar/chat-bar.component';
import {PickerModule} from "@ctrl/ngx-emoji-mart";
import {ForwardComponent} from './components/forward/forward.component';
import {NewContactComponent} from './components/new-contact/new-contact.component';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {UploadFileComponent} from './components/upload-file/upload-file.component';
import {environment} from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    BoxChatComponent,
    SearchChatComponent,
    SearchMessageComponent,
    SidebarComponent,
    GroupChatComponent,
    ChatBarComponent,
    NewContactComponent,
    ForwardComponent,
    UploadFileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
  ],
  providers: [WebsocketService, ChatService, AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

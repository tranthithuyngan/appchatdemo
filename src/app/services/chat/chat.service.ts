import {Injectable, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import * as Rx from 'rxjs';
import {WebsocketService} from "../websocket/websocket.service";
import {AnonymousSubject} from "rxjs/internal/Subject";
import {Message} from "../message-convert/message-convert.service";

export interface User {
  name: any,
  type: any,
}

export interface Room {
  name: any,
  type: any,
  messages: Message[],
  maxPage: number | undefined,
  users: User[]
}


@Injectable({providedIn: 'root'})
export class ChatService implements OnInit {
  public messages: AnonymousSubject<any>;

  constructor(private wsService: WebsocketService) {
    this.messages = <AnonymousSubject<any>>this.wsService.connect(environment.CHAT_URL).pipe(
      Rx.map((response: MessageEvent): any => JSON.parse(response.data))
    );
  }

  ngOnInit(): void {
    if (this.wsService.subject?.closed) this.connect();

  }

  public connect() {
    this.messages = <AnonymousSubject<any>>this.wsService.connect(environment.CHAT_URL).pipe(
      Rx.map((response: MessageEvent): any => JSON.parse(response.data))
    );
  }

  login(data: any) {
    const {user, pass} = data;
    const message = {action: environment.action, data: {event: environment.event.LOGIN, data: {user, pass}}};
    this.messages.next(message);
  }


  reLogin(data: any) {
    const {user, code} = data;
    if (user && code) {
      const message = {action: environment.action, data: {event: environment.event.RE_LOGIN, data: {user, code}}};
      this.messages.next(message);
    }
  }

  logout() {
    const message = {action: environment.action, data: {event: environment.event.LOGOUT}}
    this.messages.next(message);
    this.wsService.close();
    this.connect();
  }


  register(data: any) {
    const {user, pass} = data;
    const message = {action: environment.action, data: {event: environment.event.REGISTER, data: {user, pass}}};
    this.messages.next(message);
  }

  sendChat(data: any) {
    const {type, to, mes} = data;
    const message = {action: environment.action, data: {event: environment.event.SEND_CHAT, data: {type, to, mes}}};
    this.messages.next(message);
  }

  createRoom(name: string) {
    const message = {action: environment.action, data: {event: environment.event.CREATE_ROOM, data: {name}}};
    this.messages.next(message);
  }

  getRoomMessage(name: string, page: number) {
    const message = {action: environment.action, data: {event: environment.event.GET_ROOM_CHAT_MES, data: {name, page}}}
    this.messages.next(message);
  }

  joinRoom(name: string) {
    const message = {action: environment.action, data: {event: environment.event.JOIN_ROOM, data: {name}}}
    this.messages.next(message);
  }

  getPeopleMessage(name: string, page: number) {
    const message = {
      action: environment.action,
      data: {event: environment.event.GET_PEOPLE_CHAT_MES, data: {name, page}}
    }
    this.messages.next(message);
  }

  checkUser(data: any) {
    const {user} = data;
    const message = {action: environment.action, data: {event: environment.event.CHECK_USER, data: {user}}}
    this.messages.next(message);
  }

  getUserList() {
    const message = {action: environment.action, data: {event: environment.event.GET_USER_LIST}};
    this.messages.next(message);
  }

}

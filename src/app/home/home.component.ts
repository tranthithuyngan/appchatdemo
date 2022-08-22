import {Component, OnInit, ViewChild} from '@angular/core';
import {ChatService, Room, User} from "../services/chat/chat.service";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {Router} from "@angular/router";
import {TimeService} from "../services/time/time.service";
import {Message} from "../services/message-convert/message-convert.service";
import {environment} from "../../environments/environment";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  user: User | undefined;
  rooms: Room[] = [];
  activeRoom: Room = {name: '', type: '', messages: [], users: [], maxPage: undefined};
  page: number = 1;
  searching: string = '';
  searchingForward: string = '';
  ready: any = false;
  isLoadingHistory: boolean = false;
  dataRetrieved: any = {change: false};
  forwardMessage: string | undefined;
  isOpenForward: boolean = false;
  @ViewChild('sidebar') sidebar: any;
  messageNewContact: any;

  constructor(
    private chatService: ChatService,
    private authenticationService: AuthenticationService,
    private timeService: TimeService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.subscribe().then(async () => {
      const token: any = this.authenticationService.getToken()
      if (!token) {
        await this.handleLogout()
      } else {
        if (AuthenticationService.isAuthenticated) {
          this.user = {name: token.user, type: 'people'};
          this.chatService.getUserList();
        } else {
          this.ready = setInterval(() => this.chatService.reLogin(token), 300);
        }
      }
    });
  }

  async subscribe() {
    this.chatService.messages.subscribe(async (message) => {
      console.log('Response from server: ', message)
      const {event, status, data} = message;
      if (event === 'AUTH' && status === 'error' && message.mes === 'User not Login') {
        const token = this.authenticationService.getToken();
        if (token) {
          await this.chatService.reLogin(token);
        } else {
          this.authenticationService.removeToken();
          await this.router.navigateByUrl('/login')
        }
      } else if (event === environment.event.RE_LOGIN) {
        await this.handleReLogin(message);
      } else if (event === environment.event.SEND_CHAT) {
        await this.receiveChat(message);
      } else if (event === environment.event.GET_USER_LIST) {
        await this.connectRooms(message);
      } else if (event === environment.event.GET_PEOPLE_CHAT_MES) {
        await this.convertResponseToPeopleChat(message);
      } else if (event === environment.event.GET_ROOM_CHAT_MES) {
        await this.convertResponseToGroupChat(message);
      } else if (event === environment.event.CREATE_ROOM) {
        await this.handleCreateRoom(message);
      } else if (event === environment.event.JOIN_ROOM) {
        await this.handleJoinRoom(message);
      } else {
        if (this.ready) clearInterval(this.ready);
      }
    });
  }

  async connectRooms(message: any) {
    if (message.status !== 'success' || !message.data) return;
    this.rooms = message.data.map((room: any) => {
      const name: any = room.name;
      const type: string = room.type === 0 ? 'people' : 'room';
      const item: Room = {name, type, messages: [], users: [], maxPage: undefined};
      return item;
    }).filter((room: Room) => !(room.name === this.user?.name && room.type === this.user?.type));
    this.rooms.forEach((room: Room) => this.getMessages(room.name, 1, room.type))
    this.activeRoom = this.rooms[0]
  }

  async getMessages(name: string, page: number, type: string) {
    if (type === 'people') this.chatService.getPeopleMessage(name, page);
    else if (type === 'room') this.chatService.getRoomMessage(name, page);
  }

  async convertResponseToPeopleChat(message: any) {
    if (message.status !== 'success') return;
    const response = message.data[0];
    if (!response) return;
    for (const room of this.rooms) {
      if (this.isLoadingHistory && (!room.maxPage || this.page <= room.maxPage)) {
        this.isLoadingHistory = false;
        this.activeRoom.messages.unshift(...this.convertMessages(message.data));
        break;
      } else {
        const condition1 = room.name === response.name || room.name === response.to;
        const condition2 = this.user?.name === response.name || this.user?.name === response.to;
        if (condition1 && condition2 && this.user?.name !== room.name && room.type === 'people') {
          room.messages = this.convertMessages(message.data);
          if (message.data.length < 50) room.maxPage = 1;
          break;
        }
      }
    }
  }

  async convertResponseToGroupChat(message: any) {
    if (message.status !== 'success') return;
    const messages = message.data.chatData;
    if (messages && messages.length > 0) {
      for (const room of this.rooms) {
        if (room.name === messages[0].to && room.type === 'room') {
          if (this.isLoadingHistory && (!room.maxPage || this.page <= room.maxPage)) {
            this.isLoadingHistory = false;
            room.messages.unshift(...this.convertMessages(messages));
            break;
          } else {
            room.messages = this.convertMessages(messages);
            if (messages.length < 50) room.maxPage = 1;
            break;
          }
        }
      }
    }
  }

  private convertMessages(messages: Message[]): Message[] {
    return messages.filter((message: any) => {
      if (message.mes) {
        message.createAt = message.createAt ? this.timeService.changeTimeZone(message.createAt) : message.createAt;
        return message;
      }
    }).reverse()
  }

  async changeRoom(room: Room) {
    if (this.activeRoom !== room) {
      this.isLoadingHistory = false;
      this.activeRoom = room;
      this.page = 1;
      await this.getMessages(this.activeRoom.name, this.page, this.activeRoom.type);
    }
  }

  async loadHistory() {
    if (!this.isLoadingHistory) {
      ++this.page;
      this.isLoadingHistory = true;
      await this.getMessages(this.activeRoom.name, this.page, this.activeRoom.type);
    }
  }

  async addPeople(name: string) {
    const room: Room = {name: name, type: 'people', messages: [], users: [], maxPage: undefined};
    this.rooms.unshift(room);
    this.chatService.sendChat({type: room.type, to: room.name, mes: ''});
  }

  async joinRoom(name: string) {
    this.chatService.joinRoom(name);
  }

  async createRoom(name: string) {
    this.chatService.createRoom(name);
  }

  async handleJoinRoom(message: any) {
    if (message.status === 'success') {
      const rooms = this.rooms.filter((room: Room) => message.data.name === room.name && room.type === 'room')
      if (!rooms || rooms.length <= 0) {
        const room: Room = {
          type: 'room',
          name: message.data.name,
          messages: message.data.chatData,
          users: message.data.userList,
          maxPage: undefined
        }
        this.rooms.unshift(room);
      } else {
        this.messageNewContact = "Is connected";
      }
    } else {
      this.messageNewContact = message.mes;
    }

  }

  async handleCreateRoom(message: any) {
    if (message.status === 'success') {
      const room: Room = {
        type: 'room',
        name: message.data.name,
        messages: message.data.chatData,
        users: [],
        maxPage: undefined
      }
      this.rooms.unshift(room);
    } else {
      this.messageNewContact = message.mes;
    }
  }

  async sendChat(message: string) {
    const data: Message = {
      id: 0,
      name: this.user?.name,
      mes: message,
      to: this.activeRoom.name,
      type: this.activeRoom.type === 'people' ? 0 : 1,
      createAt: this.timeService.now(),
    };
    this.activeRoom.messages.push(data);
    this.rooms = this.rooms.filter(room => room != this.activeRoom);
    this.rooms.unshift(this.activeRoom);
    this.dataRetrieved = {change: true};
    this.chatService.sendChat({type: this.activeRoom.type, to: this.activeRoom.name, mes: data.mes});

  }

  async receiveChat(message: any) {
    if (message.status === 'success') {
      const data = message.data;
      data.createAt = data.createAt ? this.timeService.changeTimeZone(data.createAt) : this.timeService.now();
      for (const room of this.rooms) {
        if ((data.type === 0 && room.name === data.name) || (data.type === 1 && room.name === data.to)) {
          room.messages.push(data);
          this.rooms = this.rooms.filter(item => item != room);
          this.rooms.unshift(room);
          break;
        }
      }

    }
  }

  async searchChat(searching: string) {
    this.searching = searching;
  }

  async searchChatForward(searching: string) {
    this.searchingForward = searching;
  }

  async handleReLogin(message: any) {
    if (message.status === 'success') {
      const token = this.authenticationService.getToken();
      this.authenticationService.setToken(JSON.stringify({...token, code: message.data.RE_LOGIN_CODE}));
      this.user = {name: token.user, type: 'people'};
      this.chatService.getUserList();
    } else {
      await this.handleLogout();
    }
    clearInterval(this.ready);
  }

  async handleLogout() {
    this.authenticationService.removeToken();
    this.chatService.logout();
    await this.router.navigateByUrl('/login')
  }

  handOpenedForward(data: any) {
    this.isOpenForward = data.isOpenForward;
    this.forwardMessage = data.content;
  }

  handleForwardChat(room: Room) {
    if (this.forwardMessage) {
      const data: Message = {
        id: 0,
        name: this.user?.name,
        mes: this.forwardMessage,
        to: room.name,
        type: room.type === 'people' ? 0 : 1,
        createAt: this.timeService.now(),
      };
      room.messages.push(data);
      this.rooms = this.rooms.filter(r => room != r);
      this.rooms.unshift(room);
      this.chatService.sendChat({type: room.type, to: room.name, mes: data.mes})
    }
  }

  closeForward() {
    this.isOpenForward = false;
  }
}

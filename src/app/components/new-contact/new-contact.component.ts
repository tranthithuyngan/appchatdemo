import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Room} from "../../services/chat/chat.service";
import {MessageConvertService} from "../../services/message-convert/message-convert.service";

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.css']
})
export class NewContactComponent implements OnInit {
  @Input() activeRoom: Room | undefined;
  @Input() rooms: Room[] | undefined;
  @Input() messageNewContact: any;
  @Output() addPeople = new EventEmitter<any>();
  @Output() createRoom = new EventEmitter<any>();
  @Output() joinRoom = new EventEmitter<any>();
  @Output() changeRoom = new EventEmitter<any>();

  isOpened: boolean = false;
  isOpenedPeople: boolean = false;
  isOpenedGroup: boolean = false;
  newContact: string = '';


  constructor(public messageConverter: MessageConvertService) {
  }

  ngOnInit(): void {
  }

  handleChangeRoom(room: Room) {
    this.messageNewContact = '';
    this.changeRoom.emit(room);
    this.newContact = '';

  }

  handleAddPeople() {
    this.messageNewContact = '';
    this.addPeople.emit(this.newContact);
    this.newContact = '';

  }

  handleCreateRoom() {
    this.messageNewContact = '';
    this.createRoom.emit(this.newContact);
    this.newContact = '';

  }

  handleJoinRoom() {
    this.messageNewContact = '';
    this.joinRoom.emit(this.newContact);
    this.newContact = '';

  }

  toggle() {
    this.messageNewContact = '';
    this.newContact = '';
    this.isOpened = !this.isOpened;
  }

  close() {
    this.newContact = '';
    this.messageNewContact = '';
    this.isOpenedPeople = false;
    this.isOpenedGroup = false;
  }

  toggleAddPeople() {
    this.newContact = '';
    this.messageNewContact = '';
    this.isOpened = !this.isOpened;
    this.isOpenedPeople = !this.isOpenedPeople;
  }

  toggleAddGroup() {
    this.newContact = '';
    this.messageNewContact = '';
    this.isOpened = !this.isOpened;
    this.isOpenedGroup = !this.isOpenedGroup;
  }


}

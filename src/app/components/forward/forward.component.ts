import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Room} from "../../services/chat/chat.service";
import {MessageConvertService} from "../../services/message-convert/message-convert.service";

@Component({
  selector: 'app-forward',
  templateUrl: './forward.component.html',
  styleUrls: ['./forward.component.css']
})
export class ForwardComponent implements OnInit {
  @Input() rooms: Room[] | undefined;
  @Input() forwardMessage: any | undefined;
  @Input() isOpenForward: boolean = false;
  @Output() sendChat = new EventEmitter();
  @Output() closeForward = new EventEmitter();
  @Output() searchChat = new EventEmitter();
  @Input() content :any |undefined;

  isOpenedSearch: boolean = true;
  searching: string = '';
  type: string = 'direct';


  constructor(public messageConverter: MessageConvertService) {
  }

  ngOnInit(): void {
  }

  close() {
    this.closeForward.emit();
  }

  forwardChat(room: Room) {
    this.sendChat.emit(room);
  }

  handleSearchChat() {
    this.searchChat.emit(this.searching);
    this.isOpenedSearch = !this.isOpenedSearch;

  }

  filterRoom(room: Room): boolean {
    if (room.type === this.type || this.type === 'direct') {
      return room.name?.includes(this.searching) || !this.searching
    }
    return false;
  }

  changeToggel() {
    var text = document.querySelector('.forward__search-input') as HTMLInputElement;
    if (text.value != "") {
      this.isOpenedSearch = !this.isOpenedSearch;
    }

  }

  deleteData() {
    if (this.isOpenedSearch === false) {
      this.searching = ''
      this.searchChat.emit(this.searching)
      this.isOpenedSearch = !this.isOpenedSearch;
    }

  }
  handleRoom(){

  }
}

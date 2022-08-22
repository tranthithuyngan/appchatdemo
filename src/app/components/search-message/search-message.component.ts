import {Component, Input, OnInit} from '@angular/core';
import {Room} from "../../services/chat/chat.service";

@Component({
  selector: 'app-search-message',
  templateUrl: './search-message.component.html',
  styleUrls: ['./search-message.component.css', '../../home/home.component.css']
})
export class SearchMessageComponent implements OnInit {
  @Input() activeRoom: Room | undefined;
  isOpenedSearch: boolean = false;
  valueSearch: string = '';
  position: number = 0;
  searching: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleSearch() {
    this.isOpenedSearch = !this.isOpenedSearch;
    if (!this.isOpenedSearch) this.removeActive();
    this.valueSearch = '';
    this.searching = [];
    this.position = 0;
  }

  public searchMessage() {
    if (this.valueSearch) {
      this.searching = [];
      this.activeRoom?.messages.forEach((message) => {
        if (message.mes === this.valueSearch) this.searching.push(message.id);
      });
      if (this.searching.length != 0) {
        this.position = 1;
        this.scrollMess(this.position);
      }else {
        this.position = 0;
        this.searching = [];
        this.removeActive();
      }
    }
  };

  public changePosition(value: any) {
    if(this.searching.length){
      this.position += value;
      if (this.position <= 0) this.position = this.searching.length;
      if (this.position > this.searching.length) this.position = 1;
      this.scrollMess(this.position);
    }
  }

  public scrollMess(value: any) {
    this.removeActive();
    let element = document.getElementById(this.searching[this.searching.length - value]);
    // @ts-ignore
    element.scrollIntoView({behavior: "smooth", block: "end"});
    // @ts-ignore
    element.querySelector('.chat-conversation__message-container__message').classList.add('active-message');
  }

  public removeActive() {
    document.querySelectorAll('.chat-conversation__message-container__message').forEach(message => {
      message.classList.remove('active-message');
    });
  }
}

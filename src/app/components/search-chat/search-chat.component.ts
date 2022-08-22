import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search-chat',
  templateUrl: './search-chat.component.html',
  styleUrls: ['./search-chat.component.css']
})
export class SearchChatComponent implements OnInit {
  @Output() searchChat = new EventEmitter();
  isOpenedSearch: boolean = false;
  searching: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  handleSearchChat() {
    this.searchChat.emit(this.searching)
  }

  toggleSearch() {
    this.isOpenedSearch = !this.isOpenedSearch;
    if (!this.isOpenedSearch) {
      this.searching = ''
      this.searchChat.emit(this.searching)
    }
  }
}

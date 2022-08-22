import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DarkModeService} from "angular-dark-mode";
import {User} from "../../services/chat/chat.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css', '../../home/home.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() user: User | undefined;
  @Input() showSidebar: boolean = true;
  @Output() logout = new EventEmitter<any>();
  public theme$ = this.darkModeService.darkMode$;
  style : String ="";

  constructor(private darkModeService: DarkModeService) {
  }

  ngOnInit(): void {
  }


  handleLogout(): void {
    this.logout.emit();
  }

  toggleTheme(): void {
    this.darkModeService.toggle();

  }
}

import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'koo';
  public isMenuCollapsed = true;

  constructor(public auth: AuthService) {
  }
  logout() {
    this.auth.logout();
  }
}

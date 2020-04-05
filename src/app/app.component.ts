import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'koo';
  public isMenuCollapsed = true;

  constructor(public auth: AngularFireAuth) {
  }
  login() {
    const provider = new auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    provider.addScope('email');
    auth().signInWithRedirect(provider);
  }
  logout() {
    this.auth.signOut();
  }
}

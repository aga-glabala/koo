import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-not-accepted',
  templateUrl: './not-accepted.component.html',
  styleUrls: ['./not-accepted.component.scss']
})
export class NotAcceptedComponent implements OnInit {

  constructor(public auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    const provider = new auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    provider.addScope('email');
    auth().signInWithRedirect(provider);
    this.router.navigate(['/']);
  }
}
 
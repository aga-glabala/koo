import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from './models/person';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    user: Observable<any>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {
      this.user = this.afAuth.user;
    }

    login() {
      const provider = new auth.FacebookAuthProvider();
      provider.addScope('public_profile');
      provider.addScope('email');
      auth().signInWithRedirect(provider);
      this.router.navigate(['/']);
    }

    logout() {
      this.afAuth.signOut().then(() => this.router.navigate(['/not-accepted']));
    }
}
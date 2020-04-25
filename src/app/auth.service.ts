import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from './models/person';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    user: Observable<Person>;
    // todo
    currentUser: Person = new Person('ghCeS1L0sOMmfokqTXPLt6Pd1v73', 'Aga');

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {
      this.user = this.afAuth.user.pipe(
        switchMap((user) => {
          if (!user) {
            this.currentUser = null;
            return of(null);
          }
          return this.afs.doc('/users/' + user.uid).get().pipe(
            map((personRef) => {
              const person = personRef.data() as Person;
              this.currentUser = person;
              return person;
            })
          );
        })
      );
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

    isAccepted(): Observable<boolean> {
      return this.afAuth.idTokenResult.pipe(
        take(1),
        map((idTokenResult) => idTokenResult ? idTokenResult.claims.accepted === true : false)
      );
    }

    isAdmin(): Observable<boolean> {
      return this.afAuth.idTokenResult.pipe(
        take(1),
        map((idTokenResult) => idTokenResult ? idTokenResult.claims.admin === true : false)
      );
    }
}

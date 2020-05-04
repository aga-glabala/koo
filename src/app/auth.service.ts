import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from './models/person';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user: Observable<Person>;
  currentUser: Person;

  private loggedIn: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService
  ) {
    FB.init({
      appId: '444601165601171',
      status: false, // the SDK will attempt to get info about the current user immediately after init
      cookie: false,  // enable cookies to allow the server to access the session
      xfbml: false,  // With xfbml set to true, the SDK will parse your page's DOM to find and initialize any social plugins that have been added using XFBML
      version: 'v2.8' // use graph api version 2.5
    });

    this.loggedIn = new BehaviorSubject(this.jwtHelperService.tokenGetter() != null && !this.jwtHelperService.isTokenExpired());

    this.user = this.loggedIn.asObservable().pipe(
      switchMap(loggedIn => loggedIn ? this.http.get<Person>('/api/auth/me') : of(null)),
      tap((user) => {
        this.currentUser = user;
      })
    );
  }

  login() {
    return new Promise((resolve, reject) => {
      FB.login(result => {
        if (result.authResponse) {
          return this.http.post<any>(`/api/auth/facebook`, { access_token: result.authResponse.accessToken })
            .toPromise()
            .then(response => {
              const token = response.token;
              if (token) {
                localStorage.setItem('id_token', token);
                this.loggedIn.next(true);
              }
              resolve(token);
            })
            .catch(() => reject());
        } else {
          reject();
        }
      }, { scope: 'public_profile,email' });
    });
  }

  logout() {
    localStorage.removeItem('id_token');
    this.loggedIn.next(false);
  }

  isAccepted(): boolean {
    return this.loggedIn.value && this.hasPermission('accepted');
  }

  isAdmin(): boolean {
    return this.loggedIn.value && this.hasPermission('admin');
  }

  private hasPermission(name: string): boolean {
    const decodedToken = this.jwtHelperService.decodeToken(localStorage.getItem('id_token'));
    return decodedToken && decodedToken.permissions ? decodedToken.permissions.includes(name) : false;
  }
}

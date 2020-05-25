import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from './models/person';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, switchMap, shareReplay, map } from 'rxjs/operators';

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
      xfbml: false,  // With xfbml set to true, the SDK will parse your page's DOM to find and initialize
                     // any social plugins that have been added using XFBML
      version: 'v2.8' // use graph api version 2.5
    });

    const currentToken = this.jwtHelperService.tokenGetter();
    this.loggedIn = new BehaviorSubject(currentToken && !this.jwtHelperService.isTokenExpired());

    const me = this.http.get<Person>('/api/auth/me').pipe(shareReplay(1, 100));
    this.user = this.loggedIn.asObservable().pipe(
      switchMap(loggedIn => {
        if (loggedIn) {
          return !this.currentUser ? me : of(this.currentUser)
        }
        return of(null);
      }),
      tap((user) => {
        this.currentUser = user;
      })
    );

    // refresh token if it is not expired and it is older than 1 day
    if (currentToken &&
      !this.jwtHelperService.isTokenExpired() &&
      this.jwtHelperService.decodeToken().iat * 1000 < new Date().getTime() - 24 * 3600 * 1000) {
      this.refreshToken().subscribe(() => {});
    }
  }

  login(): Promise<Person>  {
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
              resolve(response.profile);
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

  refreshToken(): Observable<void> {
    return this.http.post<any>('/api/auth/refreshToken', {}).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('id_token', response.token);
        }
      })
    );
  }

  private hasPermission(name: string): boolean {
    const decodedToken = this.jwtHelperService.decodeToken(localStorage.getItem('id_token'));
    return decodedToken && decodedToken.permissions ? decodedToken.permissions.includes(name) : false;
  }
}

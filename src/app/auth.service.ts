import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from './models/person';

import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { tap, switchMap, shareReplay, map, catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {

  get currentUser(): Person {
    return this.userSubject.getValue();
  }
  get userId(): string {
    const decodedToken = this.jwtHelperService.decodeToken(localStorage.getItem('id_token'));
    return decodedToken.id;
  }
  get user(): Observable<Person> {
    return this.userSubject.asObservable();
  }

  private loggedInSubject: BehaviorSubject<boolean>;
  private userSubject: BehaviorSubject<Person>;

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
    this.loggedInSubject = new BehaviorSubject(currentToken && !this.jwtHelperService.isTokenExpired());
    this.userSubject = new BehaviorSubject(null);

    const me = this.http.get<Person>('/api/auth/me').pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.logout();
        }
        return throwError(error);
      })
    );
    this.loggedInSubject.pipe(
      switchMap(loggedIn => {
        if (loggedIn) {
          return !this.currentUser ? this.http.get<Person>('/api/auth/me') : of(this.currentUser);
        }
        return of(null);
      })
    ).subscribe((user) => {
      this.userSubject.next(user);
    });

    if (currentToken) {
      // refresh token if it is not expired and it is older than 1 day
      if (!this.jwtHelperService.isTokenExpired() &&
      this.jwtHelperService.decodeToken().iat * 1000 < new Date().getTime() - 24 * 3600 * 1000) {
        this.refreshToken().subscribe(() => {});
      } else if (this.jwtHelperService.isTokenExpired()) {
        localStorage.removeItem('id_token');
      }
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
                this.loggedInSubject.next(true);
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
    this.loggedInSubject.next(false);
  }

  isAccepted(): boolean {
    return this.loggedInSubject.value && this.hasPermission('accepted');
  }

  isAdmin(): boolean {
    return this.loggedInSubject.value && this.hasPermission('admin');
  }

  refreshToken(): Observable<void> {
    return this.http.post<any>('/api/auth/refreshToken', {}).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('id_token', response.token);
          this.loggedInSubject.next(true);
        }
      })
    );
  }

  private hasPermission(name: string): boolean {
    const decodedToken = this.jwtHelperService.decodeToken(localStorage.getItem('id_token'));
    return decodedToken && decodedToken.permissions ? decodedToken.permissions.includes(name) : false;
  }
}

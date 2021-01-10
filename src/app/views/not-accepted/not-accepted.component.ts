import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-not-accepted',
  templateUrl: './not-accepted.component.html',
  styleUrls: ['./not-accepted.component.scss']
})
export class NotAcceptedComponent implements OnInit {
  loader = false;
  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (user && user.accepted && !this.auth.isAccepted()) {
        this.auth.refreshToken().subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    });
  }

  login() {
    this.loader = true;
    this.auth.login().then((profile) => {
      console.log(profile);
      this.router.navigate(['/']);
      this.loader = false;
    }, (error) => {
      console.error(error);
      this.loader = false;
    });
  }
}

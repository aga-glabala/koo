import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-not-accepted',
  templateUrl: './not-accepted.component.html',
  styleUrls: ['./not-accepted.component.scss']
})
export class NotAcceptedComponent implements OnInit {
  loader : boolean = false;
  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.loader = true;
    this.auth.login().then((token) => {
      // TODO refresh nav bar ?
      this.router.navigate(['/']);
      this.loader = false;
    }, (error) => {
      console.error(error);
      this.loader = false;
    });
  }
}
 
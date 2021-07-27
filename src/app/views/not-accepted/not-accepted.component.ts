import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-not-accepted',
  templateUrl: './not-accepted.component.html',
  styleUrls: ['./not-accepted.component.scss']
})
export class NotAcceptedComponent implements OnInit {
  loader = false;
  loginForm: FormGroup;
  loadingForm = false;
  submittedForm = false;
  error = '';
  constructor(public auth: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (user && user.accepted && !this.auth.isAccepted()) {
        this.auth.refreshToken().subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  get f() { return this.loginForm.controls; }

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

  onSubmit() {
    this.submittedForm = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loadingForm = true;
    this.auth.loginForm(this.f.username.value, this.f.password.value)
        .subscribe(
            data => {
              this.loadingForm = false;
              this.router.navigate(['/']);
            },
            error => {
                this.error = error;
                this.loadingForm = false;
            });
}
}

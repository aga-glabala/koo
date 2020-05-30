import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../models/person';
import { PeopleService } from '../people.service';
import { AuthService } from '../auth.service';
import { TitleService } from '../title.service';
import { MsgService } from '../msg.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  page = 1;
  people: Person[];

  constructor(private route: ActivatedRoute, private router: Router, private peopleService: PeopleService,
              private auth: AuthService, private title: TitleService, private msg: MsgService) { }

  ngOnInit(): void {
    this.getPeople();
    const page = +this.route.snapshot.paramMap.get('page');
    if (page) {
      this.page = page;
      this.title.setTitle(['Lista użytkowników', 'Strona ' + page]);
    } else {
      this.title.setTitle(['Lista użytkowników']);
    }
  }

  getPeople(): void {
    this.peopleService.getPeople(true).subscribe((people) => {
      this.people = people;
    });
  }

  pageChangeAction(newPage: number) {
    this.router.navigate(['people', newPage], {skipLocationChange: true});
    this.page = newPage;
  }

  isAdmin() {
    return this.auth.isAdmin();
  }

  makeAdmin(person: Person) {
    this.peopleService.makeAdmin(person.id).subscribe(() => {
      person.admin = true;
    }, (err) => {
      console.error(err);
      this.msg.showError(err.message);
    });
  }

  removeAdmin(person: Person) {
    this.peopleService.removeAdmin(person.id).subscribe(() => {
      person.admin = false;
    }, (err) => {
      console.error(err);
      this.msg.showError(err.message);
    });
  }

  removeUser(person: Person) {
    this.peopleService.deletePerson(person.id).subscribe((people) => {
      this.people = this.people.filter((p) => p.id !== person.id);
    }, (err) => {
      console.error(err);
      this.msg.showError(err.message);
    });
  }
}

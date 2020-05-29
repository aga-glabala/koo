import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../models/person';
import { PeopleService } from '../people.service';
import { AuthService } from '../auth.service';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  page = 1;
  people: Person[];

  constructor(private route: ActivatedRoute, private router: Router, private peopleService: PeopleService,
              private auth: AuthService, private title: TitleService) { }

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
}

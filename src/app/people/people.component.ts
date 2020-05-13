import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../models/person';
import { PeopleService } from '../people.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  page: number = 1;
  people : Person[];

  constructor(private route: ActivatedRoute, private router: Router, private peopleService: PeopleService, private auth: AuthService) { }

  ngOnInit(): void {
    this.getPeople();
    let page = +this.route.snapshot.paramMap.get('page');
    if(page) {
      this.page = page;
    }
  }

  getPeople(): void {
    this.peopleService.getPeople(true).subscribe((people) => {
      this.people = people;
    });
  }

  pageChangeAction(newPage: number) {
    this.router.navigate(['/people/'+newPage]);
    this.page = newPage;
  }

  isAdmin() {
    return this.auth.isAdmin();
  }
}

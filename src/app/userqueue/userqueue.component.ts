import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../models/person';
import { PeopleService } from '../people.service';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-userqueue',
  templateUrl: './userqueue.component.html',
  styleUrls: ['./userqueue.component.scss']
})
export class UserQueueComponent implements OnInit {
  page = 1;
  people: Person[];

  constructor(private route: ActivatedRoute, private router: Router, private peopleService: PeopleService, private title: TitleService) { }

  ngOnInit(): void {
    this.getPeople();
    const page = +this.route.snapshot.paramMap.get('page');
    if (page) {
      this.page = page;
      this.title.setTitle(['Kolejka użytkowników', 'Strona ' + page]);
    } else {
      this.title.setTitle(['Kolejka użytkowników']);
    }
  }

  getPeople(): void {
    this.peopleService.getPeople(false).subscribe((people) => {
      this.people = people;
    });
  }

  acceptUser(id: string) {
    this.peopleService.acceptUser(id).subscribe(() => {
      console.log('accepted');
    }, (error) => {
      console.error(error);
    });
  }

  pageChangeAction(newPage: number) {
    this.router.navigate(['userqueue', newPage], {skipLocationChange: true});
    this.page = newPage;
  }
}

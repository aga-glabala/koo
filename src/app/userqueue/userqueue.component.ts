import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../models/person';
import { PeopleService } from '../people.service';

@Component({
  selector: 'app-userqueue',
  templateUrl: './userqueue.component.html',
  styleUrls: ['./userqueue.component.scss']
})
export class UserQueueComponent implements OnInit {
  page: number = 1;
  people : Person[];

  constructor(private route: ActivatedRoute, private router: Router, private peopleService: PeopleService) { }

  ngOnInit(): void {
    this.getPeople();
    let page = +this.route.snapshot.paramMap.get('page');
    if(page) {
      this.page = page;
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
    this.router.navigate(['/userqueue/'+newPage]);
    this.page = newPage;
  }
}

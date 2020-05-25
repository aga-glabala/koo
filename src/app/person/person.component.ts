import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person } from '../models/person';
import { PeopleService } from '../people.service';
import { ActionsService } from '../actions.service';
import { Action } from '../models/action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  person: Person;
  actions: Observable<Action[]>;
  constructor(private route: ActivatedRoute, private peopleService: PeopleService, private actionsService: ActionsService) { }

  ngOnInit(): void {
    this.getPerson();
  }

  getPerson(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.peopleService.getPerson(id).subscribe((person) => {
      this.person = person;

      this.actions = this.actionsService.getUserActions(id);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person } from '../../models/person';
import { PeopleService } from '../../services/people.service';
import { ActionsService } from '../../services/actions.service';
import { Action } from '../../models/action';
import { Observable } from 'rxjs';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  person: Person;
  actions: Observable<Action[]>;
  constructor(private route: ActivatedRoute, private peopleService: PeopleService, private actionsService: ActionsService,
              private title: TitleService) { }

  ngOnInit(): void {
    this.getPerson();
  }

  getPerson(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.peopleService.getPerson(id).subscribe((person) => {
      this.person = person;
      this.title.setTitle([person.name, 'Profil użytkownika']);

      this.actions = this.actionsService.getUserActions(id);
    });
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Person } from '../../models/person';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'koo-personpicker',
  templateUrl: './personpicker.component.html',
  styleUrls: ['./personpicker.component.scss']
})
export class PersonpickerComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() controlName;
  @Input() placeholder: string;
  @Input() idname: string;
  people: Person[];
  constructor(private peopleService: PeopleService) { }

  ngOnInit(): void {
    this.getPeople();
  }

  getPeople(): void {
    this.peopleService.getPeople(true).subscribe((people) => {
      this.people = people;
    });
  }

  personSelectorSearch = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 2 ? []
      : this.people.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )
  personSelectorFormatter = (result: Person) => result.name;
}

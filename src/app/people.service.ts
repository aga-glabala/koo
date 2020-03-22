import { Injectable } from '@angular/core';
import { PEOPLE } from './mocks/people-mock';
import { Person } from './models/person';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor() {}

  getPeople(): Person[] {
      return PEOPLE;
  }

  getPerson(id: string) : Person {
    for(let i = 0; i < PEOPLE.length; i++) {
        if(id === PEOPLE[i].id) {
            return PEOPLE[i];
        }
    } 
  }
}

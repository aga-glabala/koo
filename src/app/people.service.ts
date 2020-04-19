import { Injectable } from '@angular/core';
import { PEOPLE } from './mocks/people-mock';
import { Person } from './models/person';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private functions: AngularFireFunctions) {}

  acceptUser(id: string): Observable<any> {
    const acceptUser = this.functions.httpsCallable('acceptUser');
    return acceptUser({ userId: id });
  }

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

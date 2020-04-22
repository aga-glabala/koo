import { Injectable } from '@angular/core';
import { PEOPLE } from './mocks/people-mock';
import { Person } from './models/person';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private functions: AngularFireFunctions, private firestore: AngularFirestore) {}

  acceptUser(id: string): Observable<any> {
    const acceptUser = this.functions.httpsCallable('acceptUser');
    return acceptUser({ userId: id });
  }

  getPeople(accepted: boolean): Observable<Person[]> {
    return this.firestore.collection<Person>('users', ref => ref.where('accepted', '==', accepted)).valueChanges().pipe(
      map((users) => users as Person[])
    );
  }

  getPerson(id: string): Observable<Person> {
    return this.firestore.doc<Person>('users/' + id).get().pipe(
      map((user) => user.data() as Person)
    );
  }
}

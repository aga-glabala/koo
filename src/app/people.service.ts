import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from './models/person';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient) {}

  acceptUser(id: string): Observable<any> {
    return this.http.post('/api/users/' + id + '/accept', { });
  }

  makeAdmin(id: string): Observable<any> {
    return this.http.post('/api/users/' + id + '/makeAdmin', { });
  }

  removeAdmin(id: string): Observable<any> {
    return this.http.post('/api/users/' + id + '/removeAdmin', { });
  }

  deletePerson(id: string): Observable<any> {
    return this.http.delete('/api/users/' + id);
  }

  getPeople(accepted: boolean): Observable<Person[]> {
    return this.http.get<Person[]>('/api/users?accepted=' + accepted);
  }

  getPerson(id: string): Observable<Person> {
    return this.http.get<Person>('/api/users/' + id);
  }
}

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';


import { Action, ProductField, HelpingAction } from './models/action';
import { Person } from './models/person';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getActions(): Observable<Action[]> {
    return this.http.get('/api/actions/').pipe(
      map((actions: Action[]) => actions.map(this._fromStoreAction))
    );
  }

  getAction(id: string): Observable<Action> {
    return this.http.get('/api/actions/' + id).pipe(
      map(this._fromStoreAction)
    );
  }

  saveAction(action : Action): Observable<Action> {
    let edit = true;
    if (!action.id) {
      edit = false;
      action.createdBy = {...new Person(this.authService.currentUser.id, this.authService.currentUser.name)};
      action.createdOn = moment();
    }
    const data = this._toStoreAction(action);
    console.log(data);
    if (edit) {
      return this.http.put<Action>('/api/actions/' + data.id, data);
    } else {
      return this.http.post<Action>('/api/actions', data);
    }
  }

  uploadPhotos(actionId: string, photos: File[]) {
    const formData: FormData = new FormData();
    photos.forEach(file => formData.append('photos[]', file, file.name));
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = { headers };
    return this.http.post<Action>('/api/actions/' + actionId + '/photos', formData, options)
      .pipe(map(evt => evt as Action));
  }

  // todo zprzenieść na backend
  getHelperActions(): Observable<HelpingAction[]> {
    return this.authService.user.pipe(
      switchMap((user) => this.http.get<Action[]>('/api/actions/').pipe(
        map((actions) => {
          return actions.filter(action => action.helpers.some(h => h.helperId == user.id))
            .map(this._fromStoreAction)
            .map(action => new HelpingAction(action, action.helpers.filter(h => h.helperId == user.id)))
        }),
        // map((actions) => {
        //   return actions;
        // })
      ))
    );
  }

  private _toStoreAction(action): any {
    const data: any = {...action};
    data.collectionDate = action.collectionDate.toDate();
    data.payDate = action.payDate.toDate();
    data.orderDate = action.orderDate.toDate();
    data.createdOn = action.createdOn.toDate();
    return data;
  }

  public _fromStoreAction(data): Action {
    const action = {...data} as Action;
    action.collectionDate = moment(data.collectionDate);
    action.payDate = moment(data.payDate);
    action.orderDate = moment(data.orderDate);
    action.createdOn = moment(data.createdOn);
    action.photoUrl = action.photos && action.photos.length > 0 ?
      '/api/actions/' + action.id + '/photos/' + action.photos[0] :
      action.photoUrl;
    return action;
  }
}

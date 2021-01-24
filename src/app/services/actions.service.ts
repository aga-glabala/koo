import { AuthService } from './auth.service';
import { Injectable, Inject } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';

import { Action } from '../models/action';
import * as moment from 'moment';
import { PriceHelper } from '../helpers/price.helper';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private http: HttpClient, @Inject('BASE_API_URL') private baseUrl: string,
              private priceHelper: PriceHelper) {
  }

  getActions(sorting: string, showArchived: boolean, filterText: string): Observable<Action[]> {
    return this.http.get('/api/actions/', {params: {sort: sorting, archived: '' + showArchived, search: filterText}}).pipe(
      map((actions: Action[]) => actions.map((action) => {
        return this._fromStoreAction(action);
      }))
    ).pipe(shareReplay(1, 300));
  }

  getAction(id: string): Observable<Action> {
    return this.http.get('/api/actions/' + id).pipe(
      map(action => this._fromStoreAction(action))
    );
  }

  removeAction(id: string): Observable<any> {
    return this.http.delete('/api/actions/' + id);
  }

  saveAction(action: Action): Observable<Action> {
    const data = this._toStoreAction(action);
    if (action.id) {
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

  getUserActions(userId: string): Observable<Action[]> {
    return this.http.get('/api/actions/user/' + userId).pipe(
      map((actions: Action[]) => actions.map((action) => {
        return this._fromStoreAction(action);
      }))
    );
  }

  private _toStoreAction(action: Action): any {
    const data: any = {...action};
    data.collectionDate = action.collectionDate.toDate();
    data.payDate = action.payDate.toDate();
    data.orderDate = action.orderDate.toDate();
    data.cost = this.priceHelper.convertPriceToNumber(data.cost);
    return data;
  }

  public _fromStoreAction(data): Action {
    const action = {...data} as Action;
    action.collectionDate = moment(data.collectionDate);
    action.payDate = moment(data.payDate);
    action.orderDate = moment(data.orderDate);
    action.createdOn = moment(data.createdOn);
    if (action.photos && action.photos.length > 0) {
      const path = '/actions/' + action.id + '/photos/' + action.photos[0];
      if (this.baseUrl) {
        action.photoUrl = this.baseUrl + path;
      } else {
        action.photoUrl = '/api/' + path;
      }
    }
    return action;
  }
}

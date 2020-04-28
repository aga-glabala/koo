import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import * as uuid from 'uuid';

import { HttpClient } from '@angular/common/http';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

import { Action } from './models/action';
import { Product } from './models/product';
import { NgbDateFirestoreAdapter } from './helpers/date.adapter';
import { Helper, Person } from './models/person';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  constructor(private http: HttpClient, private authService: AuthService, private dateAdapter: NgbDateFirestoreAdapter) {
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

  saveAction(action, products, helpers): Observable<Action> {
    let edit = true;
    action.products = products;
    action.helpers = helpers;
    if (!action.id) {
      edit = false;
      action.createdBy = {...new Person(this.authService.currentUser.id, this.authService.currentUser.name)};
      action.createdOn = new Date();
    }
    delete action.actionid;
    const data = this._toStoreAction(action);
    console.log(data);
    if (edit) {
      return this.http.put<Action>('/api/actions/' + data.id, data);
    } else {
      return this.http.post<Action>('/api/actions', data);
    }
  }


  private _toStoreAction(action): any {
    const data: any = {...action};
    data.collectionDate = this.dateAdapter.toModel(action.collectionDate, action.collectionTime);
    data.payDate = this.dateAdapter.toModel(action.payDate, action.payTime);
    data.orderDate = this.dateAdapter.toModel(action.orderDate, action.orderTime);
    // data.createdOn = this.dateAdapter.toModel(action.createdOn, action.collectionTime);

    delete data.collectionTime;
    delete data.payTime;
    delete data.orderTime;
    return data;
  }

  private _fromStoreAction(data): Action {
    const action = {...data} as Action;
    action.collectionDate = new Date(data.collectionDate);
    action.payDate = new Date(data.payDate);
    action.orderDate = new Date(data.orderDate);
    action.createdOn = new Date(data.createdOn);
    return action;
  }
}

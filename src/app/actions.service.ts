import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Action } from './models/action';
import { ACTIONS } from './mocks/actions-mock';
import { PRODUCTS } from './mocks/product-mock';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private actions: Observable<Action[]>;

  constructor(private firestore: AngularFirestore) {
    this.actions = firestore.collection('actions').valueChanges().pipe(
      map((data: any) => {
        data.forEach((action) => {
          console.log(data);
          action.collectionDate = new Date(action.collectionDate.seconds * 1000);
          action.payDate = new Date(action.payDate.seconds * 1000);
          action.orderDate = new Date(action.orderDate.seconds * 1000);
        });
        return data;
      })
    );
  }

  getActions(): Observable<Action[]> {
      return this.actions;
  }

  getAction(id: string): Observable<Action> {
    return this.firestore.collection('actions').doc(id).valueChanges().pipe(
      map((action: any) => {
        action.collectionDate = new Date(action.collectionDate.seconds * 1000);
        action.payDate = new Date(action.payDate.seconds * 1000);
        action.orderDate = new Date(action.orderDate.seconds * 1000);
        action.createdBy = action.createdBy.name;
        // TODO helpers
        return action as Action;
      })
    );
  }

  getActionProducts(actionId: string): Observable<any[]> {
    return this.firestore.collection('actions/' + actionId + '/products').valueChanges();
  }
}

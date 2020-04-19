import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Action } from './models/action';
import { Product } from './models/product';
import { NgbDateFirestoreAdapter } from './adapters/date.adapter';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private actions: Observable<Action[]>;

  constructor(private firestore: AngularFirestore, private dateAdapter: NgbDateFirestoreAdapter) {
    this.actions = firestore.collection('actions').valueChanges().pipe(
      map((data: any) => {
        data.forEach((action) => {
          console.log(data);
          this._fromStoreAction(action);
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
        this._fromStoreAction(action);
        // TODO helpers
        return action as Action;
      })
    );
  }

  getActionProducts(actionId: string): Observable<any[]> {
    return this.firestore.collection<Product[]>('actions/' + actionId + '/products').valueChanges();
  }

  saveAction(id, action, products, helpers) {
    this._toStoreAction(action);
    this.firestore.collection('actions').doc(id).update(action.newaction);
  }

  addAction(action, products, helpers) {
    this._toStoreAction(action);
    let fs = this.firestore;
    this.firestore.collection('actions').add(action)
      .then(function(refId) {
        let productsCollection = fs.collection('actions').doc(refId.id).collection('products');

        for(let product of products) {
          productsCollection.add({...product});
        }
      });
  }

  private _toStoreAction(action) {
    action.collectionDate = this.dateAdapter.toModel(action.collectionDate);
    action.payDate = this.dateAdapter.toModel(action.payDate);
    action.orderDate = this.dateAdapter.toModel(action.orderDate);
  }

  private _fromStoreAction(action) {
    action.collectionDate = this.dateAdapter.fromModel(action.collectionDate);
    action.payDate = this.dateAdapter.fromModel(action.payDate);
    action.orderDate = this.dateAdapter.fromModel(action.orderDate);
  }
}

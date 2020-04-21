import { Injectable } from '@angular/core';
import * as uuid from 'uuid';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Action } from './models/action';
import { Product } from './models/product';
import { NgbDateFirestoreAdapter } from './adapters/date.adapter';
import { Helper } from './models/person';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private actions: Observable<Action[]>;

  constructor(private firestore: AngularFirestore, private dateAdapter: NgbDateFirestoreAdapter) {
    this.actions = firestore.collection('actions').valueChanges().pipe(
      map((data: any) => {
        data.forEach((action) => {
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
    const docRef = this.firestore.collection('actions').doc(id);
    const products = docRef.collection('products').get();
    const helpers = docRef.collection('helpers').get();
    return combineLatest([
      docRef.get().pipe(
        map((doc) => doc.data() as Action)
      ),
      products.pipe(
        map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data() as Product))
      ),
      helpers.pipe(
        map((querySnapshot) => querySnapshot.docs.map((doc) => doc.data() as Helper))
      )
    ]).pipe(
      map((values) => {
        const action = values[0];
        action.products = values[1];
        action.helpers = values[2];
        this._fromStoreAction(action);
        return action;
      })
    );
  }

  getActionProducts(actionId: string): Observable<any[]> {
    return this.firestore.collection<Product[]>('actions/' + actionId + '/products').valueChanges();
  }

  getActionHelpers(actionId: string): Observable<any[]> {
    return this.firestore.collection<Product[]>('actions/' + actionId + '/helpers').valueChanges();
  }

  saveAction(action, products, helpers) {
    this._toStoreAction(action);
    let edit: boolean = true;
    let that = this;
    if(action.actionid) {
      action.id = action.actionid;
      delete action.actionid;
    } else {
      action.id = uuid.v4();
      edit = false;
    }
    console.log(action);
    const actionRef = this.firestore.collection('actions').doc(action.id);
    if(edit) {
      actionRef.update(action).then(_afterSaveAction);
    } else {
      actionRef.set(action).then(_afterSaveAction);
    }

    function _afterSaveAction() {
      let productsCollection = actionRef.collection('products');
      that.getActionProducts(action.id).subscribe((storedProducts) => {
        // remove removed products from store
        for(let storedProduct of storedProducts) {
          var found: boolean = false;
          for(let product of products) {
            if(product.id && product.id === storedProduct.id) {
              found = true;
            }
          }
          //czy to nie wywoła nowego odświeżenia w subscribe? 
          if(!found) {
            productsCollection.doc(storedProduct.id).delete();
          }
        }

        for(let product of products) {
          if(!product.id) {
            product.id = uuid.v4();
            productsCollection.doc(product.id).set({...product});
          } else {
            productsCollection.doc(product.id).update({...product});
          }
          
        }
      });
    }
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

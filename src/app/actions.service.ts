import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Action } from './models/action';
import { ACTIONS } from './mocks/actions-mock';
import { PRODUCTS } from './mocks/product-mock';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  actions: Observable<any[]>;
  constructor(firestore: AngularFirestore) {
    this.actions = firestore.collection('actions').valueChanges();
  }

  getActions(): Action[] {
      return ACTIONS;
  }

  getAction(id: string) : Action {
    for(let i = 0; i < ACTIONS.length; i++) {
        if(id === ACTIONS[i].id) {
            ACTIONS[i].products = PRODUCTS;
            return ACTIONS[i];
        }
    } 
  }
}

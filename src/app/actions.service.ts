import { Injectable } from '@angular/core';
import { Action } from './models/action';
import { ACTIONS } from './mocks/actions-mock';
import { PRODUCTS } from './mocks/product-mock';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  constructor() {}

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

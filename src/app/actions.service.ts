import { Injectable } from '@angular/core';
import { ACTIONS } from './actions-mock';
import { Action } from './action';

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
            return ACTIONS[i];
        }
    } 
  }
}

import { Injectable } from '@angular/core';
import * as uuid from 'uuid';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private firestore: AngularFirestore, private auth: AuthService) {
    
  }

  getOrder(actionId: string) {
    //todo upewnić się że jest zalogowany user
    return this.firestore.collection('actions/' + actionId + '/orders/', ref => ref.where("ownerId", "==", this.auth.currentUser.id).limit(1)).valueChanges();
  }

  saveOrder(actionId, order) {
    let edit: boolean = true;
    if(!order.id) {
      order.id = uuid.v4();
      edit = false;
    }
    console.log(order);

    //todo ładowanie zamówienia
    //todo upewnić się że jest zalogowany user

    let orderDoc = {
      id: order.id,
      ownerId: this.auth.currentUser.id,
      ownerName: this.auth.currentUser.name,
      products: order.products
    };

    if(order.picker) {
      orderDoc['pickerId'] = order.picker.id;
      orderDoc['pickerName'] = order.picker.name;
    }


    const orderRef = this.firestore.doc('actions/' + actionId + '/orders/' + order.id);
    if(edit) {
      orderRef.update(orderDoc);
    } else {
      orderRef.set(orderDoc);
    }
  }
}

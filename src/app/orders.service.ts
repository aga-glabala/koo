import { Injectable } from '@angular/core';
import * as uuid from 'uuid';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Order } from './models/order';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  getOrders(actionId: string): Observable<Order[]> {
    return this.http.get<Order[]>('/api/actions/' + actionId + '/orders');
  }

  getOrder(actionId: string): Observable<Order> {
    return this.auth.user.pipe(
      switchMap((user) => this.http.get<Order>('/api/actions/' + actionId + '/orders?forUser=' + user.id))
    );
  }

  saveOrder(actionId, order) {
    const edit = !!order.id;

    const orderDoc = {
      actionId,
      ownerId: this.auth.currentUser.id,
      ownerName: this.auth.currentUser.name,
      products: order.products
    };

    if (order.id) {
      orderDoc['id'] = order.id;
    }
    if (order.picker) {
      orderDoc['pickerId'] = order.picker.id;
      orderDoc['pickerName'] = order.picker.name;
    }

    if (edit) {
      return this.http.put<Order>('/api/orders/' + order.id, orderDoc);
    } else {
      return this.http.post<Order>('/api/orders', orderDoc);
    }
  }
}

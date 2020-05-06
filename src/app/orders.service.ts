import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Order } from './models/order';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  getOrders(actionId: string): Observable<Order[]> {
    return this.http.get<Order[]>('/api/actions/' + actionId + '/orders').pipe(
      map((orders: Order[]) => orders.map(this.toOrderObj))
    );
  }

  getOrder(actionId: string): Observable<Order> {
    return this.auth.user.pipe(
      switchMap((user) => this.http.get<Order>('/api/actions/' + actionId + '/myorders?forUser=' + user.id))
    );
  }

  getUserOrders(): Observable<Order[]> {
    return this.auth.user.pipe(
      switchMap((user) => this.http.get<Order[]>('/api/userorders?forUser=' + user.id)),
      map((orders: Order[]) => orders.map(this.toOrderObj))
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

  toOrderObj(orderStr) : Order {
    return new Order(orderStr.id, orderStr.ownerId, orderStr.ownerName, orderStr.pickerId, 
      orderStr.pickerName, orderStr.actionId, orderStr.paid ? orderStr.paid : 0, orderStr.picked, orderStr.products);
  }
}

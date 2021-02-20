import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { map } from 'rxjs/operators';
import { ActionsService } from './actions.service';
import { Product } from '../models/product';
import { PriceHelper } from '../helpers/price.helper';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient, private auth: AuthService, private actionsService: ActionsService,
              private priceHelper: PriceHelper) {
  }

  getOrders(actionId: string): Observable<Order[]> {
    return this.http.get<Order[]>('/api/actions/' + actionId + '/orders').pipe(
      map((orders: Order[]) => orders.map(this.toOrderObj))
    );
  }

  getOrder(actionId: string): Observable<Order> {
    return this.http.get<Order>('/api/actions/' + actionId + '/myorders?forUser=' + this.auth.userId);
  }

  removeOrder(orderId: string): Observable<Order> {
    return this.http.delete<Order>('/api/orders/' + orderId);
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('/api/userorders?forUser=' + this.auth.userId).pipe(
      map((orders: Order[]) => orders.map((order) => {
        const orderObj = this.toOrderObj(order);
        orderObj.action = this.actionsService._fromStoreAction(orderObj.action);
        return orderObj;
      }))
    );
  }

  saveOrder(actionId: string, order, newProducts: Product[]) {
    const edit = !!order.id;

    const orderDoc = {
      actionId,
      products: order.products,
      newProducts,
      id: '',
      pickerId: '',
      pickerName: ''
    };

    if (order.id) {
      orderDoc.id = order.id;
    }
    if (order.picker) {
      orderDoc.pickerId = order.picker.id;
      orderDoc.pickerName = order.picker.name;
    }

    if (edit) {
      return this.http.put<Order>('/api/orders/' + order.id, orderDoc);
    } else {
      return this.http.post<Order>('/api/orders', orderDoc);
    }
  }

  markPickedOrder(order: Order) {
    return this.http.post('/api/order/picked', {id: order.id, picked: !order.picked});
  }

  markPaidOrder(order: Order, amount: number) {
    return this.http.post('/api/order/paid', {id: order.id, amount: this.priceHelper.convertPriceToNumber(amount)});
  }

  toOrderObj(orderStr): Order {
    return new Order(orderStr.id, orderStr.ownerId, orderStr.ownerName, orderStr.pickerId,
      orderStr.pickerName, orderStr.actionId, orderStr.paid ? orderStr.paid : 0, orderStr.picked,
      orderStr.products, orderStr.action);
  }
}

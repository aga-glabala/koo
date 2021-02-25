import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Action } from '../../models/action';
import { ActionsService } from '../../services/actions.service';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order';
import { DateHelper } from '../../helpers/date.helper';
import { AuthService } from '../../services/auth.service';
import { TitleService } from '../../services/title.service';
import { ProductFieldHelper } from '../../helpers/productfield.helper';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[];
  action: Action;
  actionEditor = false;
  sums: {} = {};
  actionId: string;
  constructor(private route: ActivatedRoute, private actionService: ActionsService, private title: TitleService,
              private ordersService: OrdersService, public auth: AuthService, public dateHelper: DateHelper,
              public pfHelper: ProductFieldHelper) { }

  ngOnInit(): void {
    this.actionId = this.route.snapshot.paramMap.get('actionid');
    this.getAction();
  }

  getAction(): void {
    this.actionService.getAction(this.actionId).subscribe((action) => {
      this.action = action;
      this.title.setTitle(['Zamówienia', 'Akcja ' + action.name]);
      this.actionEditor = this.action.createdBy && this.auth.currentUser && (this.action.createdBy.id === this.auth.userId);

      for (const helper of this.action.helpers) {
        if (this.auth.userId === helper.helperId) {
          this.actionEditor = true;
        }
      }

      this.getOrders();
    });
  }

  getOrders(): void {
    const that = this;
    this.ordersService.getOrders(this.actionId).subscribe((orders) => {
      that.orders = orders as Order[];
    });
  }

  orderPicked = (order: Order) => {
    this.ordersService.markPickedOrder(order).subscribe(() => {
      this.getOrders();
    });
    return false;
  }

  orderPaid = (order: Order, amount: number) => {
    this.ordersService.markPaidOrder(order, amount).subscribe(() => {
      this.getOrders();
    });
    return false;
  }

  countDiscount(price: number) {
    return Math.ceil(price - price * this.action.discount / 100);
  }

}

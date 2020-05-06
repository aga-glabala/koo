import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { OrdersService } from '../orders.service';
import { Order } from '../models/order';
import { DateHelper } from '../helpers/date.helper';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders : Order[];
  action : Action;
  actionEditor : boolean = false;
  sums: {} = {};
  constructor(private route: ActivatedRoute, private actionService: ActionsService, private ordersService: OrdersService, public auth: AuthService, public dateHelper: DateHelper) { }

  ngOnInit(): void {
    const actionId = this.route.snapshot.paramMap.get('actionid');
    this.getAction(actionId);
  }

  getAction(actionId: string): void {
    this.actionService.getAction(actionId).subscribe((action) => {
      this.action = action;
      this.actionEditor = this.action.createdBy && this.auth.currentUser && (this.action.createdBy.id == this.auth.currentUser.id);
      
      for(let helper of this.action.helpers) {
        if(this.auth.currentUser.id == helper.helperId) {
          this.actionEditor = true;
        }
      }

      this.getOrders(actionId);
    });
  }

  getOrders(actionId: string): void {
    const that = this;
    this.ordersService.getOrders(actionId).subscribe(function(orders) {
      that.orders = orders as Order[];

      for(let order of that.orders) {
        that.sums[order.id] = order.countSum(that.action.products);
      }
    });
  }
  
}
 
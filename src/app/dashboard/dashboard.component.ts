import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Action, HelpingAction } from '../models/action';
import { ActionsService } from '../actions.service';
import { Observable, combineLatest } from 'rxjs';
import { OrdersService } from '../orders.service';
import { map } from 'rxjs/operators';
import { Order, UserOrder } from '../models/order';
import { DateHelper } from '../helpers/date.helper';
import { Product } from '../models/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  actionModal : Action;
  actions : Observable<Action[]>;
  userOrders : Observable<UserOrder[]>;
  helperActions : Observable<HelpingAction[]>;

  constructor(private actionsService: ActionsService, private ordersService: OrdersService, private modalService: NgbModal, public dateHelper: DateHelper) { }

  ngOnInit(): void {
    this.getActions();
  }  
  
  getActions(): void {
    this.actions = this.actionsService.getActions().pipe(
      map(actions => {
        actions.sort((action1, action2) => {
          return action1.orderDate.valueOf() - action2.orderDate.valueOf();
        });

        actions.slice(0, 6);
        return actions;
      })
    );
    this.userOrders = combineLatest([
      this.actions,
      this.ordersService.getUserOrders()
    ]).pipe(
      map((values) => {
        const actions : Action[] = values[0];
        const orders : Order[] = values[1];
        return actions.map((action) => {
          const str = new UserOrder(action, null);
          const matchingOrder = orders.find((order) => action.id === order.actionId);
          if (matchingOrder) {
            str.order = matchingOrder;
          }
          // todo zwracać str tylko jak ma order!
          return str;
        });
      })
    );

    // todo drugi raz uderza po akcje bez sensu
    this.helperActions = this.actionsService.getHelperActions();
  }
  
  open(content, action : Action) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.actionModal = action;
    return false;
  }

  /*
   * Prints products user ordered
   */
  printProducts(userOrder : UserOrder) {
    let arr : Product[] = userOrder.action.products.filter((product: Product) => userOrder.order.products[product.id] && userOrder.order.products[product.id] > 0)
    const str: string = arr.map((product) => product.name).join(', ');
    return str;
  }
}

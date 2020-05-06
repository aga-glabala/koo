import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { Observable, combineLatest } from 'rxjs';
import { OrdersService } from '../orders.service';
import { map, filter } from 'rxjs/operators';
import { Order, UserOrder } from '../models/order';
import { Helper } from '../models/person';
import { DateHelper } from '../helpers/date.helper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  payment = '';
  actions : Observable<Action[]>;
  userOrders : Observable<UserOrder[]>;
  helperActions : Observable<Action[]>;

  constructor(private actionsService: ActionsService, private ordersService: OrdersService, private modalService: NgbModal, public dateHelper: DateHelper) { }

  ngOnInit(): void {
    this.getActions();
  }  
  
  getActions(): void {
    this.actions = this.actionsService.getActions();
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
  
  open(content, payment) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.payment = payment;
    return false;
  }

  printProducts(products) {
    const str: string = products.map((product) => product.name).join(', ');

    return str;
  }
}

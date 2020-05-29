import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth.service';
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
import { TitleService } from '../title.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  actionModal: Action;
  actions: Action[];
  userOrders: UserOrder[];
  helperActions: HelpingAction[];
  loaderOrders = false;
  loaderHelpers = false;
  loaderActions = false;

  constructor(private actionsService: ActionsService, private ordersService: OrdersService,
              private modalService: NgbModal, public dateHelper: DateHelper, public auth: AuthService,
              private http: HttpClient, private title: TitleService) { }

  ngOnInit(): void {
    this.getActions();
    this.title.setTitle(['Strona główna']);
  }

  getActions(): void {
    this.loaderOrders = true;
    this.loaderHelpers = true;
    this.loaderActions = true;
    this.http.get<Dashboard>('/api/dashboard').subscribe(dashboard => {
      this.actions = dashboard.actions.map(a => this.actionsService._fromStoreAction(a));
      this.userOrders = dashboard.userOrders.map(uo => {
        uo.action = this.actionsService._fromStoreAction(uo.action);
        uo.order = this.ordersService.toOrderObj(uo.order);
        return new UserOrder(uo.action, uo.order);
      });
      this.helperActions = dashboard.helperActions.map(ha => { 
        ha.action = this.actionsService._fromStoreAction(ha.action);
        return new HelpingAction(ha.action, ha.helpers);
      });
      this.loaderOrders = false;
      this.loaderHelpers = false;
      this.loaderActions = false;
    });
  }

  open(content, action: Action) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.actionModal = action;
    return false;
  }

  /*
   * Prints products user ordered
   */
  printProducts(userOrder: UserOrder) {
    const arr: Product[] = userOrder.action.products.filter(
      (product: Product) => userOrder.order.products[product.id] && userOrder.order.products[product.id] > 0);
    const str: string = arr.map((product) => product.name).join(', ');
    return str;
  }
}

class Dashboard {
  actions: Action[];
  userOrders: UserOrder[];
  helperActions: HelpingAction[];
}

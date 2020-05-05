import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { Observable } from 'rxjs';
import { OrdersService } from '../orders.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  payment = '';
  actions : Observable<Action[]>;

  constructor(private actionsService: ActionsService, private ordersService: OrdersService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getActions();
  }  
  
  getActions(): void {
    this.actions = this.actionsService.getActions();
    this.ordersService.getUserOrders().pipe(map(function(order) {
      console.log(order);
    }))
  }
  
  open(content, payment) {
    let modal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.payment = payment;
    return false;
  }
}


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateHelper } from '../helpers/date.helper';
import { OrdersService } from '../orders.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  page: number = 1;
  orders : Order[];
  payment : string = '';
  constructor(private route: ActivatedRoute, private router: Router, private ordersService: OrdersService, private modalService: NgbModal, public dateHelper: DateHelper) { }

  ngOnInit(): void { 
    this.getUserOrders();
    let page = +this.route.snapshot.paramMap.get('page');
    if(page) {
      this.page = page;
    }
  }

  getUserOrders(): void {
    this.ordersService.getUserOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  pageChangeAction(newPage: number) {
    this.router.navigate(['/myorders/'+newPage]);
    this.page = newPage;
  }
  
  openModal(content, payment) {
    let modal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.payment = payment;
    return false;
  }
}


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateHelper } from '../helpers/date.helper';
import { OrdersService } from '../orders.service';
import { Order } from '../models/order';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  page = 1;
  orders: Order[];
  actionModal: Action;
  constructor(private route: ActivatedRoute, private router: Router, private ordersService: OrdersService,
              private modalService: NgbModal, public dateHelper: DateHelper, private title: TitleService) { }

  ngOnInit(): void {
    this.getUserOrders();
    const page = +this.route.snapshot.paramMap.get('page');
    if (page) {
      this.page = page;
      this.title.setTitle(['Moje zamówienia', 'Strona ' + page]);
    } else {
      this.title.setTitle(['Moje zamówienia']);
    }
  }

  getUserOrders(): void {
    this.ordersService.getUserOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  pageChangeAction(newPage: number) {
    this.router.navigate(['myorders', newPage], {skipLocationChange: true});
    this.page = newPage;
  }
  openModal(content, action) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.actionModal = action;
    return false;
  }

  pickedOrder(order: Order) {
    const that = this;
    this.ordersService.markPickedOrder(order).subscribe(() => {
      that.getUserOrders();
    });
    return false;
  }
}

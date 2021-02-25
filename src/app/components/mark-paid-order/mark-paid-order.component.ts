import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-mark-paid-order',
  templateUrl: './mark-paid-order.component.html',
  styleUrls: ['./mark-paid-order.component.scss']
})
export class MarkPaidOrderComponent implements OnInit {
  @Input() order: Order;
  @Input() actionEditor: boolean;
  @Input() orderPaid: (order: Order, amount: number) => boolean;
  constructor() { }

  ngOnInit(): void {
  }

}

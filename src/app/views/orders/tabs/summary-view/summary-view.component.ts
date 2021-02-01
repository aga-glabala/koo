import { Component, Input, OnInit } from '@angular/core';
import { ProductFieldHelper } from 'src/app/helpers/productfield.helper';
import { Product } from 'src/app/models/product';
import { Action } from '../../../../models/action';
import { Order } from '../../../../models/order';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.scss']
})
export class SummaryViewComponent implements OnInit {
  @Input() action: Action;
  @Input() orders: Order[];
  @Input() sums: {string: number};
  constructor(public pfHelper: ProductFieldHelper) { }

  ngOnInit(): void {
  }

  countOrders(product: Product): number {
    let sum = 0;
    for (const order of this.orders) {
      sum += order.products[product.id];
    }
    return sum > 0 ? sum : undefined;
  }
}

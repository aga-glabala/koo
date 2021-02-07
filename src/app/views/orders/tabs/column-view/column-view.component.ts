import { Component, Input, OnInit } from '@angular/core';
import { ProductFieldHelper } from 'src/app/helpers/productfield.helper';
import { Action } from '../../../../models/action';
import { Order } from '../../../../models/order';

@Component({
  selector: 'app-column-view',
  templateUrl: './column-view.component.html',
  styleUrls: ['./column-view.component.scss']
})
export class ColumnViewComponent implements OnInit {
  @Input() action: Action;
  @Input() orders: Order[];
  @Input() sums: {string: number};
  @Input() actionEditor: boolean;
  @Input() orderPicked: (order: Order) => boolean;
  @Input() orderPayed: (order: Order, amount: number) => boolean;
  constructor(public pfHelper: ProductFieldHelper) { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { ProductFieldHelper } from 'src/app/helpers/productfield.helper';
import { Action } from '../../../../models/action';
import { Order } from '../../../../models/order';

@Component({
  selector: 'app-checks-view',
  templateUrl: './checks-view.component.html',
  styleUrls: ['./checks-view.component.scss']
})
export class ChecksViewComponent implements OnInit {
  @Input() action: Action;
  @Input() orders: Order[];
  @Input() sums: {string: number};
  constructor(public pfHelper: ProductFieldHelper) { }

  ngOnInit(): void {
  }

}

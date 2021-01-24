import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-price',
  template: `
    <ng-container *ngIf="discount">
      <s>{{ price + modifier | price }}</s>&nbsp;
      <strong class="text-success">{{ count() | price}}</strong>
    </ng-container>
    <ng-container *ngIf="!discount">
      {{ price + modifier | price }}
    </ng-container>
  `
})
export class PriceComponent {
  @Input() price: number;
  @Input() discount: number;
  @Input() modifier = 0;
  newPrice: number;
  constructor() {
  }

  count() {
    return Math.ceil(this.price - this.price * this.discount / 100) + this.modifier;
  }
}

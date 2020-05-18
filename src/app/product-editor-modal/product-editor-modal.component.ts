import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductField } from '../models/action';
import { Product } from '../models/product';
import { PriceHelper } from '../helpers/price.helper';

@Component({
  selector: 'app-product-editor-modal',
  templateUrl: './product-editor-modal.component.html',
  styleUrls: ['./product-editor-modal.component.scss']
})
export class ProductEditorModalComponent implements OnInit {
  @Input() fields: ProductField[];
  @Input() product: Product;
  price: number;

  constructor(public activeModal: NgbActiveModal, public priceHelper: PriceHelper) { }

  ngOnInit(): void {
    if (!this.product.customFields) {
      this.product.customFields = {};
    }
    this.price = this.priceHelper.convertPriceToFloat(this.product.price);
  }

  save() {
    this.product.price = this.priceHelper.convertPriceToNumber(this.price);
    this.activeModal.close(true);
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductField } from '../models/action';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-editor-modal',
  templateUrl: './product-editor-modal.component.html',
  styleUrls: ['./product-editor-modal.component.scss']
})
export class ProductEditorModalComponent implements OnInit {
  @Input() fields: ProductField[];
  @Input() product : Product;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if(!this.product.customFields) {
      this.product.customFields = {};
    }
  }

  save() {
    this.activeModal.dismiss();
  }

}

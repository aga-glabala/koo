import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductField } from '../models/action';
import { Product } from '../models/product';
import { PriceHelper } from '../helpers/price.helper';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-import-products-modal',
  templateUrl: './import-products-modal.component.html',
  styleUrls: ['./import-products-modal.component.scss']
})
export class ImportProductsModalComponent implements OnInit {
  products: Product[] = [];
  file;
  loader;
  innerProducts: Product[] = [];
  constructor(public activeModal: NgbActiveModal, public priceHelper: PriceHelper) {}

  ngOnInit(): void {}

  save() {
    this.activeModal.close(this.products);
  }

  onFileChange($event) {
    this.loader = true;
    const that = this;
    Papa.parse($event.target.files[0], {
      complete: (json) => {
        that.loader = false;
        console.log(json.data);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < json.data.length; i++) {
          that.innerProducts.push(new Product(undefined, json.data[i].name, json.data[i].variant, json.data[i].price, {}));
        }
        console.error(json.errors);
      },
      header: true
    });
  }
}

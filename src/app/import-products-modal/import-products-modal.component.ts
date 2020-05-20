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
  file;
  loader;
  innerProducts: Product[] = [];
  customFields: ProductField[];
  constructor(public activeModal: NgbActiveModal, public priceHelper: PriceHelper) {}

  ngOnInit(): void {}

  save() {
    this.activeModal.close({products: this.innerProducts, customFields: this.customFields});
  }

  onFileChange($event) {
    this.loader = true;
    const that = this;
    Papa.parse($event.target.files[0], {
      complete: (json) => {
        that.loader = false;
        if (json.meta.fields.indexOf('name') < 0) {
          console.error('W tabeli jedna z kolumn powinna się nazywać "name"');
          return;
        }
        if (json.meta.fields.indexOf('variant') < 0) {
          console.error('W tabeli jedna z kolumn powinna się nazywać "variant"');
          return;
        }
        if (json.meta.fields.indexOf('price') < 0 ) {
          console.error('W tabeli jedna z kolumn powinna się nazywać "price"');
          return;
        }

        that.customFields = json.meta.fields.filter((name: string) => name !== 'name' && name !== 'variant' && name !== 'price')
                              .map((name: string) => new ProductField(undefined, name));

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < json.data.length; i++) {
          const fields = {};
          for (const field of that.customFields) {
            fields[field.id] = json.data[i][field.name];
          }

          let price = json.data[i].price.replace(',', '.').match(/[\d\.]+/g);
          if (price.length > 0) {
            price = that.priceHelper.convertPriceToNumber(+price[0]);
          } else {
            price = 0;
          }

          that.innerProducts.push(new Product(undefined, json.data[i].name, json.data[i].variant, price, fields));
        }

        if (json.errors && json.errors.length > 0) {
          console.error(json.errors);
        }
      },
      header: true
    });
  }
}

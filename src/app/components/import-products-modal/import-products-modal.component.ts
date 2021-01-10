import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductField } from '../../models/action';
import { Product } from '../../models/product';
import { PriceHelper } from '../../helpers/price.helper';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-import-products-modal',
  templateUrl: './import-products-modal.component.html',
  styleUrls: ['./import-products-modal.component.scss']
})
export class ImportProductsModalComponent implements OnInit {
  loader = false;
  innerProducts: Product[] = [];
  customFields: ProductField[];
  errors: string[] = [];
  warnings: string[] = [];
  constructor(public activeModal: NgbActiveModal, public priceHelper: PriceHelper) {}

  ngOnInit(): void {}

  save() {
    this.activeModal.close({products: this.innerProducts, customFields: this.customFields});
  }

  onFileChange($event) {
    this.loader = true;
    const that = this;
    this.errors = [];
    this.warnings = [];
    Papa.parse($event.target.files[0], {
      complete: (json) => {
        that.loader = false;
        if (json.meta.fields.indexOf('name') < 0) {
          that.errors.push('W tabeli jedna z kolumn powinna się nazywać "name"');
        }
        if (json.meta.fields.indexOf('variant') < 0) {
          that.errors.push('W tabeli jedna z kolumn powinna się nazywać "variant"');
        }
        if (json.meta.fields.indexOf('price') < 0 ) {
          that.errors.push('W tabeli jedna z kolumn powinna się nazywać "price"');
        }

        if (that.errors.length > 0) {
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

          if (json.data[i] && json.data[i].name && json.data[i].price) {
            let price = json.data[i].price.replace(',', '.');
            const decimal = price.split('.');
            price = +price;
            if (Number.isNaN(price) || price < 0 || (decimal.length > 1 && decimal[1].length > 2)) {
              price = 0;
              that.warnings.push('Cena nie może być ujemna, zawierać liter lub mieć więcej niż 2 miejsca po przecinku' +
                ' - te ceny zostały wyzerowane, ustaw w następnym kroku prawidłowe ceny.');
            } else {
              price = that.priceHelper.convertPriceToNumber(price);
            }

            that.innerProducts.push(new Product(undefined, json.data[i].name, json.data[i].variant, price, fields));
          } else {
            if (i < json.data.length - 1) { // ignore last empty line
              that.warnings.push('W linii ' + (i + 1) + 'brakuje ceny lub nazwy - została zignorowana.');
            }
          }
        }

        if (json.errors && json.errors.length > 0) {
          for (const error of json.errors) { // ignore last empty line
            if (error.row < json.data.length - 1) {
              that.errors.push('Linia: ' + error.row + 'Wiadomość:' + error.message);
            }
          }
        }
      },
      header: true
    });
  }
}

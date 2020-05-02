import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Helper } from '../models/person';
import { Product } from '../models/product';
import { ProductField } from '../models/action';

@Injectable()
export class ActionFormService {
  public form: FormGroup;
  products: Product[] = [];
  helpers : Helper[] = [];

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
        newaction: this.fb.group({
          id: '',
          name: '',
          photoUrl: '',
          orderDate: '',
          orderTime: {"hour": 0, "minute": 0},
          payDate: '',
          payTime: {"hour": 0, "minute": 0},
          payLock: false,
          collectionDate: '',
          collectionTime: {"hour": 0, "minute": 0},
          description: '',
          rules: '',
          collection: '',
          payment: '',
          productsEditable: false
        }),
        newperson: this.fb.group({
          person: '',
          description: ''
        }),
        newproduct: this.fb.group({
          name: '',
          variant: '',
          price: '',
          customFields: this.fb.group({})
        }),
      });

  }

  addNewProduct(customFields : ProductField[]) {
    const product = new Product(undefined,
      this.form.value.newproduct.name, 
      this.form.value.newproduct.variant, 
      this.form.value.newproduct.price,
      {});

    product.customFields = {};
    for(let field of customFields) {
      product.customFields[field.id] = this.form.value.newproduct.customFields[field.id];
    }

    this.products.push(product);
    this.form.get('newproduct').reset();
  }

  removeProduct(id: number) {
    this.products.splice(id, 1);
  }

  addNewHelper() {
    this.helpers.push(new Helper(this.form.value.newperson.person, this.form.value.newperson.description));
    this.form.get('newperson').reset();
  }

  removeHelper(id: number) {
    this.helpers.splice(id, 1);
  }

  addNewCustomField(id: string) {
    (this.form.get('newproduct').get('customFields') as FormGroup).addControl(id, this.fb.control(''))
  }

  loadAction(data): void {

    // todo przydalaby się jakaś walidacja?
    let formdata = {
        newaction: {
            ...data
        }
    };
    formdata.newaction.orderDate = {'day': data.orderDate.getDate(), 'month': data.orderDate.getMonth() + 1, 'year': data.orderDate.getFullYear()};
    formdata.newaction.payDate = {'day': data.payDate.getDate(), 'month': data.payDate.getMonth() + 1, 'year': data.payDate.getFullYear()};
    formdata.newaction.collectionDate = {'day': data.collectionDate.getDate(), 'month': data.collectionDate.getMonth() + 1, 'year': data.collectionDate.getFullYear()};

    formdata.newaction.orderTime = {'hour': data.orderDate.getHours(), 'minute': data.orderDate.getMinutes()};
    formdata.newaction.payTime = {'hour': data.payDate.getHours(), 'minute': data.payDate.getMinutes()};
    formdata.newaction.collectionTime = {'hour': data.collectionDate.getHours(), 'minute': data.collectionDate.getMinutes()};

    if(data.customFields) {
      for(let field of data.customFields) {
        this.addNewCustomField(field.id);
      }
    }

    this.form.patchValue(formdata);

    this.products = data.products ? data.products : [];
    this.helpers = data.helpers ? data.helpers : [];
  }
}
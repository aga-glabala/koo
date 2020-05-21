import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Helper } from '../models/person';
import { Product } from '../models/product';
import { ProductField, Action } from '../models/action';
import { ActionFormAdapter } from '../helpers/action.adapter';
import { pastDateValidator } from '../helpers/past-date.validator';

@Injectable()
export class ActionFormService {
  public form: FormGroup;
  products: Product[] = [];
  helpers: Helper[] = [];

  constructor(
    private fb: FormBuilder, private actionAdapter: ActionFormAdapter
  ) {
    this.form = this.fb.group({
        newaction: this.fb.group({
          id: '',
          name: new FormControl('', [Validators.required]),
          orderDate: new FormControl(''),
          orderTime: {hour: 0, minute: 0},
          payDate: '',
          payTime: {hour: 0, minute: 0},
          payLock: false,
          collectionDate: '',
          collectionTime: {hour: 0, minute: 0},
          description: '',
          rules: '',
          collection: '',
          payment: '',
          productsEditable: false,
          photo: ''
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

  addNewProduct(customFields: ProductField[]) {
    const product = new Product(undefined,
      this.form.value.newproduct.name,
      this.form.value.newproduct.variant,
      this.form.value.newproduct.price,
      {});

    product.customFields = {};
    for (const field of customFields) {
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
    (this.form.get('newproduct').get('customFields') as FormGroup).addControl(id, this.fb.control(''));
  }

  loadAction(data): void {
    const formdata = this.actionAdapter.toForm(data);
    if (data.customFields) {
      for (const field of data.customFields) {
        this.addNewCustomField(field.id);
      }
    }

    this.form.patchValue(formdata);

    this.products = data.products ? data.products : [];
    this.helpers = data.helpers ? data.helpers : [];
  }

  getData(action: Action, customFields: ProductField[]) {
    const newAction = this.actionAdapter.fromForm(this.form.get('newaction').value, this.helpers, this.products, customFields,
      action ? action.createdBy : undefined, action ? action.createdOn : undefined, action ? action.photos : []);

    return newAction;
  }
}

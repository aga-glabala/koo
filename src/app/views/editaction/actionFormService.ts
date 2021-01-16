import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ProductField, Action } from '../../models/action';
import { priceValidator } from '../../helpers/price.helper';
import { ActionFormAdapter } from '../../helpers/action.adapter';

@Injectable()
export class ActionFormService {
  public form: FormGroup;

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
          photo: '',
          discount: new FormControl(0, [priceValidator]),
          cost: new FormControl(0, [priceValidator])
        }),
      });
  }
}

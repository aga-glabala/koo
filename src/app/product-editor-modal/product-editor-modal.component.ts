import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductField } from '../models/action';
import { Product } from '../models/product';
import { PriceHelper, priceValidator } from '../helpers/price.helper';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-editor-modal',
  templateUrl: './product-editor-modal.component.html',
  styleUrls: ['./product-editor-modal.component.scss']
})
export class ProductEditorModalComponent implements OnInit {
  @Input() fields: ProductField[];
  @Input() product: Product;
  public form: FormGroup;
  price: number;

  constructor(public activeModal: NgbActiveModal, public priceHelper: PriceHelper, private fb: FormBuilder) { }

  ngOnInit(): void {
    const fields = {};

    if (this.fields) {
      for (const field of this.fields) {
        fields[field.id] = this.product.customFields && this.product.customFields[field.id] ? this.product.customFields[field.id] : '';
      }
    } else {
      this.product.customFields = {};
    }
    this.price = this.priceHelper.convertPriceToFloat(this.product.price);

    this.form = this.fb.group({
      name: new FormControl(this.product.name, [Validators.required]),
      variant: this.product.variant,
      price: new FormControl(this.price, [Validators.required, priceValidator]),
      customFields: this.fb.group(fields)
    });
  }

  validationClassProduct(name: string) {
    if (this.form.get(name).value || this.form.get(name).touched) {
      return this.form.get(name).errors ? 'is-invalid' : 'is-valid';
    } else {
      return '';
    }
  }

  save() {
    this.product.name = this.form.value.name;
    this.product.variant = this.form.value.variant;
    this.product.price = this.priceHelper.convertPriceToNumber(this.form.value.price);
    this.product.customFields = this.form.value.customFields;
    this.activeModal.close(true);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportProductsModalComponent } from 'src/app/components/import-products-modal/import-products-modal.component';
import { ProductEditorModalComponent } from 'src/app/components/product-editor-modal/product-editor-modal.component';
import { ProductFieldModalComponent } from 'src/app/components/product-field-modal/product-field-modal.component';
import { ProductFieldHelper } from 'src/app/helpers/productfield.helper';
import { ProductField } from 'src/app/models/action';
import { Product } from 'src/app/models/product';
import { priceValidator, PriceHelper } from '../../../helpers/price.helper';

@Component({
  selector: 'koo-productseditor',
  templateUrl: './products.component.html'
})
export class ProductsEditorComponent implements OnInit {
  @Input() products: Product[];
  @Input() customFields: ProductField[];
  public form: FormGroup;
  
  constructor(private fb: FormBuilder, private modalService: NgbModal, private priceHelper: PriceHelper, public pfHelper: ProductFieldHelper) {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required]),
      variant: '',
      price: new FormControl('', [Validators.required, priceValidator]),
      customFields: this.fb.group({})
    });

  }

  ngOnInit() {
    if(this.customFields) {
      for (const field of this.customFields) {
        this.addNewCustomField(field.id);
      }
    }
  }

  openProductFieldModal() {
    const modalRef = this.modalService.open(ProductFieldModalComponent);
    modalRef.componentInstance.fields = this.customFields;
    modalRef.componentInstance.addNewCustomField = this.addNewCustomField;
    return false;
  }

  importFromFile() {
    const modalRef = this.modalService.open(ImportProductsModalComponent, { size: 'xl' });
    const that = this;
    modalRef.result.then((data) => {
      that.customFields = data.customFields;
      that.products.push(...data.products);
      if (data.customFields) {
        for (const field of data.customFields) {
          that.addNewCustomField(field.id);
        }
      }
    });
    return false;
  }

  addNewProduct = () => {
    const product = new Product(undefined,
      this.form.value.name,
      this.form.value.variant,
      this.priceHelper.convertPriceToNumber(this.form.value.price),
      {});

    product.customFields = {};
    for (const field of this.customFields) {
      product.customFields[field.id] = this.form.value.customFields[field.id];
    }

    this.products.push(product);
    this.form.reset();
  }

  removeProduct(id: number) {
    this.products.splice(id, 1);
  }

  editProduct(index: number) {
    const product = {...this.products[index]} as Product;

    const modalRef = this.modalService.open(ProductEditorModalComponent);
    modalRef.componentInstance.fields = this.customFields;
    modalRef.componentInstance.product = product;

    const that = this;

    modalRef.result.then((save) => {
      if (save) {
        that.products[index] = product;
      }
    });
    return false;
  }

  addNewCustomField = (id: string) => {
    (this.form.get('customFields') as FormGroup).addControl(id, this.fb.control(''));
  }

  validationClassProduct(name: string) {
    if (this.form.get(name).value || this.form.get(name).touched) {
      return this.form.get(name).errors ? 'is-invalid' : 'is-valid';
    } else {
      return '';
    }
  }

}
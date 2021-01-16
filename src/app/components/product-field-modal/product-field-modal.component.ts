import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductField } from '../../models/action';
import { ActionFormService } from '../../views/editaction/actionFormService';

@Component({
  selector: 'app-product-field-modal',
  templateUrl: './product-field-modal.component.html',
  styleUrls: ['./product-field-modal.component.scss']
})
export class ProductFieldModalComponent implements OnInit {
  @Input() fields: ProductField[];
  @Input() addNewCustomField;
  newField: string;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  addNewField() {
    const productField = new ProductField(undefined, this.newField);
    this.fields.push(productField);
    this.addNewCustomField(productField.id);
    this.newField = '';
  }

  removeField(index: number) {
    this.fields.splice(index, 1);
  }

  saveFields() {
    console.log(this.fields);
    this.activeModal.close('Close click');
  }
}

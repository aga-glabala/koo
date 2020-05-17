import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductField } from '../models/action';
import * as uuid from 'uuid';
import { ActionFormService } from '../editaction/actionFormService';

@Component({
  selector: 'app-product-field-modal',
  templateUrl: './product-field-modal.component.html',
  styleUrls: ['./product-field-modal.component.scss']
})
export class ProductFieldModalComponent implements OnInit {
  @Input() fields: ProductField[];
  @Input() formService: ActionFormService;
  newField: string;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  addNewField() {
    const productField = new ProductField(uuid.v4(), this.newField);
    this.fields.push(productField);
    this.formService.addNewCustomField(productField.id);
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

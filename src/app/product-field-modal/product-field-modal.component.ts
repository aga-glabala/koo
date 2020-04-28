import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductField } from '../models/action';
import * as uuid from 'uuid';

@Component({
  selector: 'app-product-field-modal',
  templateUrl: './product-field-modal.component.html',
  styleUrls: ['./product-field-modal.component.scss']
})
export class ProductFieldModalComponent implements OnInit {
  @Input() fields: ProductField[];
  newField: string;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  addNewField() {
    this.fields.push(new ProductField(uuid.v4(), this.newField));
    this.newField = '';
  }
  saveFields() {
    console.log(this.fields);
    this.activeModal.close('Close click');
  }
}

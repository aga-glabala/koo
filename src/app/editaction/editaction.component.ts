import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Action, ProductField } from '../models/action';
import { ActionsService } from '../actions.service';
import { ActionFormService } from './actionFormService';
import { Person, Helper } from '../models/person';
import { Product } from '../models/product';
import { ProductFieldModalComponent } from '../product-field-modal/product-field-modal.component';
import { ProductEditorModalComponent } from '../product-editor-modal/product-editor-modal.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-editaction',
  templateUrl: './editaction.component.html',
  styleUrls: ['./editaction.component.scss'],
  providers: [ActionFormService]
})
export class EditActionComponent implements OnInit {
  action: Action;
  people : Person[];
  mode = 'new';
  public Editor = ClassicEditor;
  toolbarConfig = { toolbar: [ 'heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', 'link',  ] };
  customFields : ProductField[] = [];
  private photos: File[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private actionService: ActionsService,
              private actionFormService: ActionFormService, private modalService: NgbModal) {
  }
  get actionForm(): FormGroup {
    return this.actionFormService.form;
  }
  get products(): Product[] {
    return this.actionFormService.products;
  }
  get helpers(): Helper[] {
    return this.actionFormService.helpers;
  }

  ngOnInit() {
    this.getAction();
  }

  getAction(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.mode = this.route.snapshot.data.mode;
    if(id) {
      this.actionService.getAction(id).subscribe((action) => {
        this.action = action;
        if (this.mode === 'duplicate') {
          this.action.id = null;
        }
        if (action) {
          this.customFields = this.action.customFields || [];
          this.actionFormService.loadAction(this.action);
        }
      });
    }

  }

  onFileChange(event)  {
    for (let i =  0; i <  event.target.files.length; i++)  {
        this.photos.push(event.target.files[i]);
    }
  }

  onSubmit() {
    const that = this;
    const product = this.actionFormService.getData(this.action, this.customFields);

    this.actionService.saveAction(product).pipe(
      switchMap(action => this.actionService.uploadPhotos(action.id, this.photos))
    ).subscribe((action: Action) => {
      that.router.navigate(['/action/' + action.id]);
    });
  }

  addNewHelper() {
    this.actionFormService.addNewHelper();
  }
  removeHelper(id: number) {
    this.actionFormService.removeHelper(id);
    return false;
  }
  addNewProduct() {
    this.actionFormService.addNewProduct(this.customFields);
  }
  removeProduct(index: number) {
    this.actionFormService.removeProduct(index);
    return false;
  }
  editProduct(index: number) {
    const product = {...this.actionFormService.products[index]} as Product;

    const modalRef = this.modalService.open(ProductEditorModalComponent);
    modalRef.componentInstance.fields = this.customFields;
    modalRef.componentInstance.product = product;

    const that = this;

    modalRef.result.then(function(save) {
      if (save) {
        that.actionFormService.products[index] = product;
      }
    });
    return false;
  }

  openProductFieldModal() {
    const modalRef = this.modalService.open(ProductFieldModalComponent);
    modalRef.componentInstance.fields = this.customFields;
    modalRef.componentInstance.formService = this.actionFormService;
    return false;
  }
}

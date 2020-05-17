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
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-editaction',
  templateUrl: './editaction.component.html',
  styleUrls: ['./editaction.component.scss'],
  providers: [ActionFormService]
})
export class EditActionComponent implements OnInit {
  action: Action;
  people: Person[];
  mode = 'new';
  public Editor = ClassicEditor;
  toolbarConfig = { toolbar: [ 'heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', 'link',  ] };
  customFields: ProductField[] = [];
  private photos: File[] = [];
  public minDate;
  showError = '';
  submitLoader = false;

  constructor(private route: ActivatedRoute, private router: Router, private actionService: ActionsService,
              private actionFormService: ActionFormService, private modalService: NgbModal, public auth: AuthService) {
    const d = new Date();
    this.minDate = {day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear()};
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

    if (id) {
      this.actionService.getAction(id).subscribe((action) => {
        if (this.mode === 'edit' && action.createdBy.id !== this.auth.currentUser.id) {
          this.router.navigate(['/action/' + action.id]);
        }

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
    for (const photo of event.target.files)  {
        this.photos.push(photo);
    }
  }

  onSubmit() {
    const that = this;
    const product = this.actionFormService.getData(this.action, this.customFields);
    this.submitLoader = true;
    this.actionService.saveAction(product).pipe(
      switchMap(action => this.actionService.uploadPhotos(action.id, this.photos))
    ).subscribe((action: Action) => {
      that.submitLoader = false;
      that.router.navigate(['/action/' + action.id]);
    },
    (err) => {
      that.submitLoader = false;
      that.showError = err.error;
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

    modalRef.result.then((save) => {
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

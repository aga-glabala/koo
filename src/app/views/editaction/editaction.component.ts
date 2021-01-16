import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Action, ProductField } from '../../models/action';
import { ActionsService } from '../../services/actions.service';
import { ActionFormService } from './actionFormService';
import { Person, Helper } from '../../models/person';
import { Product } from '../../models/product';
import { ProductFieldModalComponent } from '../../components/product-field-modal/product-field-modal.component';
import { ProductEditorModalComponent } from '../../components/product-editor-modal/product-editor-modal.component';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { ImportProductsModalComponent } from '../../components/import-products-modal/import-products-modal.component';
import { TitleService } from '../../services/title.service';
import { ProductFieldHelper } from '../../helpers/productfield.helper';

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
              private actionFormService: ActionFormService, private modalService: NgbModal, public auth: AuthService,
              private title: TitleService, public pfHelper: ProductFieldHelper) {
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
        if (this.mode === 'edit' && action.createdBy.id !== this.auth.userId) {
          this.router.navigate(['/action/' + action.id]);
        }

        this.action = action;
        if (this.mode === 'duplicate') {
          this.action.id = null;
          this.title.setTitle(['Duplikowanie akcji', action.name]);
        } else {
          this.title.setTitle(['Edycja akcji', action.name]);
        }
        if (action) {
          this.customFields = this.action.customFields || [];
          this.actionFormService.loadAction(this.action);
        }
      });
    } else {
      this.title.setTitle(['Nowa akcja']);
    }

  }

  onFileChange(event)  {
    for (const photo of event.target.files)  {
        this.photos.push(photo);
    }
  }

  onSubmit() {
    const that = this;
    const action = this.actionFormService.getData(this.action, this.customFields);
    this.submitLoader = true;
    this.actionService.saveAction(action).pipe(
      switchMap(savedaction => {
        if (this.photos.length === 0) {
          return of(savedaction);
        }
        return this.actionService.uploadPhotos(savedaction.id, this.photos);
      })
    ).subscribe((savedaction: Action) => {
      that.submitLoader = false;
      that.router.navigate(['/action/' + savedaction.id]);
    },
    (err) => {
      that.submitLoader = false;
      that.showError = err.error;
    });
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

  importFromFile() {
    const modalRef = this.modalService.open(ImportProductsModalComponent, { size: 'xl' });
    const that = this;
    modalRef.result.then((data) => {
      that.customFields = data.customFields;
      that.actionFormService.products = data.products;
      if (data.customFields) {
        for (const field of data.customFields) {
          that.actionFormService.addNewCustomField(field.id);
        }
      }
    });
    return false;
  }

  validationClass(name: string) {
    if (this.actionForm.get('newaction').get(name).value || this.actionForm.get('newaction').get(name).touched) {
      return this.actionForm.get('newaction').get(name).errors ? 'is-invalid' : 'is-valid';
    } else {
      return '';
    }
  }

  validationClassProduct(name: string) {
    if (this.actionForm.get('newproduct').get(name).value || this.actionForm.get('newproduct').get(name).touched) {
      return this.actionForm.get('newproduct').get(name).errors ? 'is-invalid' : 'is-valid';
    } else {
      return '';
    }
  }
}

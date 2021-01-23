import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Action, ProductField } from '../../models/action';
import { ActionsService } from '../../services/actions.service';
import { ActionFormService } from './actionFormService';
import { Person, Helper } from '../../models/person';
import { Product } from '../../models/product';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { TitleService } from '../../services/title.service';
import { ActionFormAdapter } from 'src/app/helpers/action.adapter';

@Component({
  selector: 'app-editaction',
  templateUrl: './editaction.component.html',
  styleUrls: ['./editaction.component.scss'],
  providers: [ActionFormService]
})
export class EditActionComponent implements OnInit {
  action: Action;
  mode = 'new';
  public Editor = ClassicEditor;
  toolbarConfig = { toolbar: [ 'heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList', 'link',  ] };
  customFields: ProductField[] = [];
  products: Product[] = [];
  helpers: Helper[] = [];
  private photos: File[] = [];
  public minDate;
  showError = '';
  submitLoader = false;

  constructor(private route: ActivatedRoute, private router: Router, private actionService: ActionsService,
              private actionFormService: ActionFormService, public auth: AuthService,
              private title: TitleService, private actionAdapter: ActionFormAdapter) {
    const d = new Date();
    this.minDate = {day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear()};
  }
  get actionForm(): FormGroup {
    return this.actionFormService.form;
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
          this.loadAction(this.action);
        }
      });
    } else {
      this.title.setTitle(['Nowa akcja']);
    }

  }

  loadAction(data: Action): void {
    const formdata = this.actionAdapter.toForm(data);
    this.actionFormService.form.patchValue(formdata);

    this.products = data.products ? data.products : [];
    this.helpers = data.helpers ? data.helpers : [];
    this.customFields = data.customFields ? data.customFields : [];
  }

  onFileChange(event)  {
    for (const photo of event.target.files)  {
        this.photos.push(photo);
    }
  }

  onSubmit() {
    const that = this;
    const action = this.actionAdapter.fromForm(this.actionForm.get('newaction').value, this.helpers, this.products, this.customFields,
          this.action ? this.action.photos : []);
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

  
  validationClass(name: string) {
    if (this.actionForm.get('newaction').get(name).value || this.actionForm.get('newaction').get(name).touched) {
      return this.actionForm.get('newaction').get(name).errors ? 'is-invalid' : 'is-valid';
    } else {
      return '';
    }
  }
}

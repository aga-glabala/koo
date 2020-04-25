import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { PeopleService } from '../people.service';
import { ActionFormService } from './actionFormService';
import { Person, Helper } from '../models/person';
import { Product } from '../models/product';

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

  constructor(private route: ActivatedRoute, private router: Router, private actionService: ActionsService, private actionFormService: ActionFormService, private peopleService: PeopleService) {
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
        if (this.mode == 'duplicate') {
          this.action.id = null;
        }
        if (action) {
          this.actionFormService.loadAction(this.action);
        }
      });
    }
    
  }

  onSubmit() {
    let that = this;
    this.actionService.saveAction(this.actionFormService.form.value.newaction, this.products, this.helpers).then(function() {
      that.router.navigate(['/action/'+that.action.id]);
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
    this.actionFormService.addNewProduct();
  }
  removeProduct(id: number) {
    this.actionFormService.removeProduct(id);
    return false;
  }
}

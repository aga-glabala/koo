import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
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

  constructor(private route: ActivatedRoute, private actionService: ActionsService, private actionFormService: ActionFormService, private peopleService: PeopleService) {
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
    this.action = this.actionService.getAction(id);

    if(this.action) {
      this.actionFormService.loadAction(this.action);
    }
    this.mode = this.route.snapshot.data.mode;

    if(this.mode == 'duplicate') {
      this.action.id = null;
    }
  }

  onSubmit() {
    // Process checkout data here
    console.warn('Action data', this.actionFormService.form);
  }

  addNewHelper() {
    this.actionFormService.addNewHelper();
    this.actionForm.get('newperson').reset();
  }
  removeHelper(id: number) {
    this.actionFormService.removeHelper(id);
    return false;
  }
  addNewProduct() {
    this.actionFormService.addNewProduct();
    this.actionForm.get('newproduct').reset();
  }
  removeProduct(id: number) {
    this.actionFormService.removeProduct(id);
    return false;
  }
}

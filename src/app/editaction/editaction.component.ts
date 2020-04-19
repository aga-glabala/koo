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
    this.mode = this.route.snapshot.data.mode;
    if(id) {
      this.actionService.getAction(id).subscribe((action) => {
        this.action = action;
        if (action) {
          this.actionFormService.loadAction(this.action);
        }
        if (this.mode == 'duplicate') {
          this.action.id = null;
        }
      });
      this.actionService.getActionProducts(id).subscribe((products) => {
        this.actionFormService.products = products;
      });
    }
  }

  onSubmit() {
    if(this.action) {
      this.actionService.saveAction(this.action.id, this.actionFormService.form.value.newaction, this.products, this.helpers);
    } else {
      this.actionService.addAction(this.actionFormService.form.value.newaction, this.products, this.helpers);
    }
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

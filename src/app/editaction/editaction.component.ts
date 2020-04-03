import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
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
    this.getPeople();
  }

  getAction(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.action = this.actionService.getAction(id);
    console.log(this.action);

    if(this.action) {
      this.actionFormService.loadAction(this.action);
    }
  }
  getPeople(): void {
    this.people = this.peopleService.getPeople();
  }

  onSubmit() {
    // Process checkout data here
    console.warn('Action data', this.actionFormService.form);
  }

  personSelectorSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.people.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  personSelectorFormatter = (result: Person) => result.name;

  addNewHelper() {
    this.actionFormService.addNewHelper();
  }
  addNewProduct() {
    this.actionFormService.addNewProduct();
  }
}

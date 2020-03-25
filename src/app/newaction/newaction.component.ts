import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { PeopleService } from '../people.service';
import { Person, Helper } from '../models/person';
import { Product } from '../models/product';

@Component({
  selector: 'app-newaction',
  templateUrl: './newaction.component.html',
  styleUrls: ['./newaction.component.scss']
})
export class NewActionComponent implements OnInit {
  actionForm;
  people : Person[];
  helpers : Helper[] = [];
  products: Product[] = [];

  constructor(private formBuilder: FormBuilder, private peopleService: PeopleService) {
    this.actionForm = this.formBuilder.group({
      newaction: this.formBuilder.group({
        name: '',
        photo: '',
        dateorder: '',
        datepay: '',
        datecollection: '',
        description: '',
        rules: '',
        collection: '',
        bankaccount: '',
      }),
      newperson: this.formBuilder.group({
        person: '',
        description: ''
      }),
      newproduct: this.formBuilder.group({
        name: '',
        variant: '',
        price: ''
      })
    });
  }

  ngOnInit() {
    this.getPeople();
  }

  getPeople(): void {
    this.people = this.peopleService.getPeople();
  }

  onSubmit() {
    // Process checkout data here
    console.warn('Action data', this.actionForm);
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
    this.helpers.push(new Helper(this.actionForm.value.newperson.person, this.actionForm.value.newperson.description));
  }
  addNewProduct() {
    this.products.push(new Product(this.actionForm.value.newproduct.name, 
      this.actionForm.value.newproduct.variant, 
      this.actionForm.value.newproduct.price));
  }
}

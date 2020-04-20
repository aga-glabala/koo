import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Action } from '../models/action';
import { ActionsService } from '../actions.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  action : Action;
  orderForm;
  sumOrder : number = 0;
  products = {};
  constructor(private route: ActivatedRoute, private actionService: ActionsService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.getAction();
  }

  getAction(): void {
    const id = this.route.snapshot.paramMap.get('actionid');
    this.actionService.getAction(id).then((action) => {
      this.action = action;
      if(this.action) {
        let products = {};

        this.action.products.forEach(product=>{
          products[product.name + product.variant]=new FormControl('');  
          this.products[product.name + product.variant] = product;
        });

        this.orderForm = new FormGroup({
          picker: new FormControl(''),
          products: new FormGroup(products)
        });

        this.orderForm.get('products').valueChanges.subscribe(values => {
          this.sumOrder = 0;
          for(let product in values) {
            this.sumOrder += values[product] * this.products[product].price;
          }
        });
      } else {
        this.orderForm = this.formBuilder.group({});
      }
    });
  }

  onSubmit() {
    // Process checkout data here
    console.warn('Action data', this.orderForm);
  }
}

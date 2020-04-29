import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { OrdersService } from '../orders.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
 
  action : Action;
  order: Order;
  orderForm;
  sumOrder : number = 0;
  products = {};
  constructor(private route: ActivatedRoute, private router: Router, private actionService: ActionsService, private formBuilder: FormBuilder, private ordersService : OrdersService) {
  }

  ngOnInit(): void { 
    const actionId = this.route.snapshot.paramMap.get('actionid');
    this.getAction(actionId);
  }

  getAction(actionId): void {
    let that = this;
    this.actionService.getAction(actionId).subscribe((action) => {
      this.action = action;
      if(this.action) {
        let products = {};

        this.action.products.forEach(product=>{
          products[product.id]=new FormControl('');  
          this.products[product.id] = product;
        });

        this.orderForm = new FormGroup({
          id: new FormControl(''),
          picker: new FormControl(''),
          products: new FormGroup(products)
        });

        this.orderForm.get('products').valueChanges.subscribe(values => {
          this.sumOrder = 0;
          for(let product in values) {
            this.sumOrder += values[product] * this.products[product].price;
          }
        });

        that.getOrder(actionId).subscribe(function(orders) {
          if(orders && orders.length > 0) {
            that.order = orders[0] as Order;

            let formdata = {
              id: that.order.id,
              products: {
                  ...that.order.products
              },
              picker: {
                id: that.order.pickerId, 
                name: that.order.pickerName
              }
            };
            that.orderForm.patchValue(formdata);
          }
        });
      } else {
        this.orderForm = this.formBuilder.group({});
      }
    });
  }

  getOrder(actionId) {
    return this.ordersService.getOrder(actionId);
  }

  onSubmit() {
    // Process checkout data here
    let that = this;
    this.ordersService.saveOrder(this.action.id, this.orderForm.value).subscribe((order) => {
      that.router.navigate(['/action/'+that.action.id+'/orders']);
    });
  }
}

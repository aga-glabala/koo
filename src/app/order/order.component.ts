import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { OrdersService } from '../orders.service';
import { Order } from '../models/order';
import { ProductEditorModalComponent } from '../product-editor-modal/product-editor-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../models/product';
import * as uuid from 'uuid';

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
  newProducts : Product[] = [];
  constructor(private route: ActivatedRoute, private router: Router, private actionService: ActionsService, private formBuilder: FormBuilder, 
    private ordersService : OrdersService, private modalService: NgbModal, private fb: FormBuilder) {
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

        that.getOrder(actionId).subscribe(function(order) {
          if(order) {
            that.order = order;

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

  addProduct() {
    let product = new Product(uuid.v4(), '', '', 0, {});
    const modalRef = this.modalService.open(ProductEditorModalComponent);
    modalRef.componentInstance.fields = this.action.customFields;
    modalRef.componentInstance.product = product;
    let that = this;

    modalRef.result.then(function(save) {
      if(save) {
        that.action.products.push(product);
        that.products[product.id] = product;
        (that.orderForm.get('products') as FormGroup).addControl(product.id, that.fb.control(''));
        that.newProducts.push(product);
      }
    });
    return false;
  }

  onSubmit() {
    // Process checkout data here
    let that = this;
    this.ordersService.saveOrder(this.action.id, this.orderForm.value, this.newProducts).subscribe((order) => {
      that.router.navigate(['/action/'+that.action.id+'/orders']);
    });
  }
}

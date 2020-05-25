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
import * as moment from 'moment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  action: Action;
  order: Order;
  orderForm;
  sumOrder = 0;
  products = {};
  newProducts: Product[] = [];
  disabled = false;
  today = moment();
  constructor(private route: ActivatedRoute, private router: Router, private actionService: ActionsService,
              private formBuilder: FormBuilder, private ordersService: OrdersService,
              private modalService: NgbModal, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    const actionId = this.route.snapshot.paramMap.get('actionid');
    this.getAction(actionId);
  }

  getAction(actionId): void {
    const that = this;
    this.actionService.getAction(actionId).subscribe((action) => {
      this.action = action;
      if (this.action) {
        const products = {};
        this.disabled = action.orderDate.isBefore(moment());

        this.action.products.forEach(product => {
          products[product.id] = new FormControl('');
          this.products[product.id] = product;
        });

        this.orderForm = new FormGroup({
          id: new FormControl(''),
          picker: new FormControl(''),
          products: new FormGroup(products)
        });

        this.orderForm.get('products').valueChanges.subscribe(values => {
          this.sumOrder = 0;
          // tslint:disable-next-line: forin
          for (const product in values) {
            this.sumOrder += values[product] * this.products[product].price;
          }
        });

        that.getOrder(actionId).subscribe((order) => {
          if (order) {
            that.order = order;

            const formdata = {
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
        },
        (err) => {});
      } else {
        this.orderForm = this.formBuilder.group({});
      }
    });
  }

  getOrder(actionId) {
    return this.ordersService.getOrder(actionId);
  }

  addProduct() {
    const product = new Product(undefined, '', '', 0, {});
    const modalRef = this.modalService.open(ProductEditorModalComponent);
    modalRef.componentInstance.fields = this.action.customFields;
    modalRef.componentInstance.product = product;
    const that = this;

    modalRef.result.then((save) => {
      if (save) {
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
    const that = this;
    this.ordersService.saveOrder(this.action.id, this.orderForm.value, this.newProducts).subscribe((order) => {
      that.router.navigate(['/action/' + that.action.id + '/orders']);
    });
  }
}

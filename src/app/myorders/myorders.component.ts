
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  page: number = 1;
  actions : Action[];
  dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  payment : string = '';
  constructor(private route: ActivatedRoute, private router: Router, private actionsService: ActionsService, private modalService: NgbModal) { }

  ngOnInit(): void { 
    this.getActions();
    let page = +this.route.snapshot.paramMap.get('page');
    if(page) {
      this.page = page;
    }
  }

  getActions(): void {
    this.actionsService.getActions().subscribe((actions) => {
      this.actions = actions;
    });
  }

  pageChangeAction(newPage: number) {
    this.router.navigate(['/myorders/'+newPage]);
    this.page = newPage;
  }
  
  openModal(content, payment) {
    let modal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.payment = payment;
    return false;
  }
}

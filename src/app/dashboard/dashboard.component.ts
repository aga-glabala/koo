import { Component, OnInit, ApplicationRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  payment = '';

  constructor(private modalService: NgbModal, private appRef: ApplicationRef) { }

  ngOnInit(): void {
  }
  
  open(content, payment) {
    let modal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    this.payment = payment;

    // todo
    // when dashboard route has ...canActivate them modal is not showing, no idea why.
    // this is ugly fix to solve this problem
    this.appRef.tick();
    return false;
  }
}

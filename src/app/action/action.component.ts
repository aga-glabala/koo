import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { DateHelper } from '../helpers/date.helper';
import { AuthService } from '../auth.service';
import * as moment from 'moment';
import { TitleService } from '../title.service';
import { ProductFieldHelper } from '../helpers/productfield.helper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MsgService } from '../msg.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  action: Action;
  today = moment();
  constructor(private route: ActivatedRoute, private router: Router, private actionService: ActionsService,
              public dateHelper: DateHelper, public auth: AuthService, private title: TitleService,
              public pfHelper: ProductFieldHelper, private modalService: NgbModal, private msg: MsgService) { }

  ngOnInit(): void {
    this.getAction();
  }

  getAction(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.actionService.getAction(id).subscribe((data) => {
      this.action = data;
      this.title.setTitle([this.action.name, 'Akcja']);
    }, (err) => {
      if (err.status === 404) {
        this.router.navigate(['/actions']);
      } else {
        console.error(err);
        this.msg.showError(err.message);
      }
    });
  }

  remove(content) {
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});

    modalRef.result.then((save) => {
      if (save) {
        this.actionService.removeAction(this.action.id).subscribe((data) => {
          this.router.navigate(['/actions']);
        });
      }
    }, (reason) => {});
    return false;
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { DateHelper } from '../helpers/date.helper';
import { AuthService } from '../auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  action: Action;
  today = moment();
  constructor(private route: ActivatedRoute, private actionService: ActionsService,
              public dateHelper: DateHelper, public auth: AuthService) { }

  ngOnInit(): void {
    this.getAction();
  }

  getAction(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.actionService.getAction(id).subscribe((data) => {
      this.action = data;
    });
  }
}

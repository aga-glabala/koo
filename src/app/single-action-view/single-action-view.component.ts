import { Component, OnInit, Input } from '@angular/core';
import { Action } from '../models/action';
import { DateHelper } from '../helpers/date.helper';

@Component({
  selector: 'koo-single-action-view',
  templateUrl: './single-action-view.component.html',
  styleUrls: ['./single-action-view.component.scss']
})
export class SingleActionViewComponent implements OnInit {
  @Input() action: Action;
  constructor(public dateHelper: DateHelper) { }

  ngOnInit(): void {
  }

}

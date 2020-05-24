import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Action } from '../models/action';
import { ActionsService } from '../actions.service';
import { DateHelper } from '../helpers/date.helper';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  page = 1;
  actions: Observable<Action[]>;
  sorting = '';
  sortingOptions = [
    {id: 'newest', label: 'Najnowsze'},
    {id: 'oldest', label: 'Najstarsze'},
    {id: 'order', label: 'Data zamawiania'},
    {id: 'pay', label: 'Data płacenia'},
    {id: 'collection', label: 'Data odbioru'}
  ];
  selectedSorting = this.sortingOptions[0];
  showArchived = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private actionsService: ActionsService, public dateHelper: DateHelper) { }

  ngOnInit(): void {
    this.getActions();
    const page = +this.route.snapshot.paramMap.get('page');
    if (page) {
      this.page = page;
    }
  }

  getActions(): void {
    this.actions = this.actionsService.getActions(this.selectedSorting.id, this.showArchived);
  }

  pageChangeAction(newPage: number) {
    this.router.navigate(['/actions/' + newPage]);
    this.page = newPage;
  }

  sort(option: {id: string, label: string}) {
    this.selectedSorting = option;
    this.getActions();
  }

  switchArchived(show: boolean) {
    this.showArchived = show;
    this.getActions();
  }
}

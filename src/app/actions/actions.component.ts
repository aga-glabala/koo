import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from '../action';
import { ActionsService } from '../actions.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  page: number = 1;
  actions : Action[];
  dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  constructor(private route: ActivatedRoute, private router: Router, private actionsService: ActionsService) { }

  ngOnInit(): void { 
    this.getActions();
    let page = +this.route.snapshot.paramMap.get('page');
    if(page) {
      this.page = page;
    }
  }

  getActions(): void {
    this.actions = this.actionsService.getActions();
  }

  pageChangeAction(newPage: number) {
    this.router.navigate(['/actions/'+newPage]);
    this.page = newPage;
  }
}

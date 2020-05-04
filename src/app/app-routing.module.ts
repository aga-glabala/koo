import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, UrlTree, Router } from '@angular/router';

import { PeopleComponent } from './people/people.component';
import { PersonComponent } from './person/person.component';
import { ActionsComponent } from './actions/actions.component';
import { ActionComponent } from './action/action.component';
import { EditActionComponent } from './editaction/editaction.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotAcceptedComponent } from './not-accepted/not-accepted.component';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';
import { UserQueueComponent } from './userqueue/userqueue.component';
import { MyOrdersComponent } from './myorders/myorders.component';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
class CanActivateAccepted implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return !this.authService.isAccepted() ? this.router.parseUrl('/not-accepted') : true;
  }
}

@Injectable()
class CanActivateAdmin implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return !this.authService.isAdmin() ? this.router.parseUrl('/') : true;
  }
}

@Injectable()
class RedirectIfAccepted implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return this.authService.isAccepted() ? this.router.parseUrl('/dashboard') : true;
  }
}

const routes: Routes = [
  { path: 'people', component: PeopleComponent, canActivate: [CanActivateAccepted] },
  { path: 'people/:page', component: PeopleComponent, canActivate: [CanActivateAccepted] },
  { path: 'userqueue', component: UserQueueComponent, canActivate: [CanActivateAdmin] },
  { path: 'userqueue/:page', component: UserQueueComponent, canActivate: [CanActivateAdmin]},
  { path: 'person/:id', component: PersonComponent, canActivate: [CanActivateAccepted] },
  { path: 'actions', component: ActionsComponent, canActivate: [CanActivateAccepted] },
  { path: 'actions/:page', component: ActionsComponent, canActivate: [CanActivateAccepted] },
  { path: 'action/:actionid/order', component: OrderComponent, canActivate: [CanActivateAccepted] },
  { path: 'action/:actionid/orders', component: OrdersComponent, canActivate: [CanActivateAccepted] },
  { path: 'action/:id', component: ActionComponent, canActivate: [CanActivateAccepted] },
  { path: 'newaction', component: EditActionComponent, data: {mode: 'new'}, canActivate: [CanActivateAccepted] },
  { path: 'action/:id/duplicate', component: EditActionComponent, data: {mode: 'duplicate'}, canActivate: [CanActivateAccepted] },
  { path: 'action/:id/edit', component: EditActionComponent, data: {mode: 'edit'}, canActivate: [CanActivateAccepted] },
  { path: 'not-accepted', component: NotAcceptedComponent, canActivate: [RedirectIfAccepted] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [CanActivateAccepted] },
  { path: 'myorders', component: MyOrdersComponent, canActivate: [CanActivateAccepted] },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanActivateAccepted, CanActivateAdmin, RedirectIfAccepted]
})
export class AppRoutingModule { }

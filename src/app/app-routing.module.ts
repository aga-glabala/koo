import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { hasCustomClaim, canActivate, AuthPipeGenerator, AngularFireAuthGuard, loggedIn } from '@angular/fire/auth-guard';

import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

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

const acceptedOnly = () => loggedIn;
const redirectIfNotAccepted: AuthPipeGenerator = () => pipe(loggedIn, map(isAccepted => isAccepted || ['not-accepted']));
const redirectIfAccepted: AuthPipeGenerator = () => pipe(loggedIn, map(isAccepted => !isAccepted || ['dashboard']));

const routes: Routes = [
  { path: 'people', component: PeopleComponent, ...canActivate(acceptedOnly) },
  { path: 'people/:page', component: PeopleComponent, ...canActivate(acceptedOnly) },
  { path: 'userqueue', component: UserQueueComponent, ...canActivate(acceptedOnly) },
  { path: 'userqueue/:page', component: UserQueueComponent, ...canActivate(acceptedOnly) },
  { path: 'person/:id', component: PersonComponent, ...canActivate(acceptedOnly) },
  { path: 'actions', component: ActionsComponent, ...canActivate(acceptedOnly) },
  { path: 'actions/:page', component: ActionsComponent, ...canActivate(acceptedOnly) },
  { path: 'action/:actionid/order', component: OrderComponent, ...canActivate(acceptedOnly) },
  { path: 'action/:actionid/orders', component: OrdersComponent, ...canActivate(acceptedOnly) },
  { path: 'action/:id', component: ActionComponent, ...canActivate(acceptedOnly) },
  { path: 'newaction', component: EditActionComponent, canActivate: [AngularFireAuthGuard], data: {mode: 'new', authGuardPipe: acceptedOnly }},
  { path: 'action/:id/duplicate', component: EditActionComponent, canActivate: [AngularFireAuthGuard], data: {mode: 'duplicate', authGuardPipe: acceptedOnly }},
  { path: 'action/:id/edit', component: EditActionComponent, canActivate: [AngularFireAuthGuard], data: {mode: 'edit', authGuardPipe: acceptedOnly }},
  { path: 'not-accepted', component: NotAcceptedComponent, ...canActivate(redirectIfAccepted) },
  { path: 'dashboard', component: DashboardComponent, ...canActivate(redirectIfNotAccepted) },
  { path: 'myorders', component: MyOrdersComponent, ...canActivate(acceptedOnly) },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { hasCustomClaim, canActivate, AuthPipeGenerator, AngularFireAuthGuard } from '@angular/fire/auth-guard';

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

const acceptedOnly = () => hasCustomClaim('accepted');
const redirectIfNotAccepted: AuthPipeGenerator = () => pipe(hasCustomClaim('accepted'), map(isAccepted => isAccepted || ['not-accepted']));
const redirectIfAccepted: AuthPipeGenerator = () => pipe(hasCustomClaim('accepted'), map(isAccepted => !isAccepted || ['dashboard']));

const routes: Routes = [
  { path: 'people', component: PeopleComponent},
  { path: 'people/:page', component: PeopleComponent },
  { path: 'userqueue', component: UserQueueComponent },
  { path: 'userqueue/:page', component: UserQueueComponent },
  { path: 'person/:id', component: PersonComponent },
  { path: 'actions', component: ActionsComponent },
  { path: 'actions/:page', component: ActionsComponent },
  { path: 'action/:actionid/order', component: OrderComponent },
  { path: 'action/:actionid/orders', component: OrdersComponent },
  { path: 'action/:id', component: ActionComponent },
  { path: 'newaction', component: EditActionComponent},
  { path: 'action/:id/duplicate', component: EditActionComponent},
  { path: 'action/:id/edit', component: EditActionComponent },
  { path: 'not-accepted', component: NotAcceptedComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'myorders', component: MyOrdersComponent },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

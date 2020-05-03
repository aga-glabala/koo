import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PeopleComponent } from './people/people.component';
import { PersonComponent } from './person/person.component';
import { ActionsComponent } from './actions/actions.component';
import { ActionComponent } from './action/action.component';
import { EditActionComponent } from './editaction/editaction.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';
import { PersonpickerComponent } from './personpicker/personpicker.component';
import { environment } from '../environments/environment';
import { NotAcceptedComponent } from './not-accepted/not-accepted.component';
import { UserQueueComponent } from './userqueue/userqueue.component';
import { MyOrdersComponent } from './myorders/myorders.component';
import { DateHelper } from './helpers/date.helper';
import { ProductFieldModalComponent } from './product-field-modal/product-field-modal.component';
import { ProductEditorModalComponent } from './product-editor-modal/product-editor-modal.component';
import { ActionFormAdapter } from './helpers/action.adapter';

@NgModule({
  declarations: [
    AppComponent,
    PeopleComponent,
    PersonComponent,
    ActionsComponent,
    ActionComponent,
    EditActionComponent,
    DashboardComponent,
    OrderComponent,
    OrdersComponent,
    PersonpickerComponent,
    NotAcceptedComponent,
    UserQueueComponent,
    MyOrdersComponent,
    ProductFieldModalComponent,
    ProductEditorModalComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CKEditorModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [
    DateHelper,
    ActionFormAdapter,
    { provide: REGION, useValue: 'europe-west3' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

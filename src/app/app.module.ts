import { BaseUrlInterceptor } from './baseurl.interceptor';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NG_VALIDATORS } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';

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
import { PriceHelper, PricePipe, PriceValidatorDirective } from './helpers/price.helper';
import { ProductFieldModalComponent } from './product-field-modal/product-field-modal.component';
import { ProductEditorModalComponent } from './product-editor-modal/product-editor-modal.component';
import { ActionFormAdapter } from './helpers/action.adapter';
import { ImportProductsModalComponent } from './import-products-modal/import-products-modal.component';
import { SingleActionViewComponent } from './single-action-view/single-action-view.component';
import { MsgComponent } from './msg/msg.component';

export function tokenGetter() {
  return localStorage.getItem('id_token');
}

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
    ProductEditorModalComponent,
    PricePipe,
    ImportProductsModalComponent,
    SingleActionViewComponent,
    PriceValidatorDirective,
    MsgComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CKEditorModule,
    NgbModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        blacklistedRoutes: [/api\/authenticate/],
      },
    }),
  ],
  providers: [
    DateHelper,
    PriceHelper,
    ActionFormAdapter,
    { provide: "BASE_API_URL", useValue: environment.apiBaseUrl },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true
    },
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

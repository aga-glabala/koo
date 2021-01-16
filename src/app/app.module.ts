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
import { AppComponent } from './components/app/app.component';
import { PeopleComponent } from './views/people/people.component';
import { PersonComponent } from './views/person/person.component';
import { ActionsComponent } from './views/actions/actions.component';
import { ActionComponent } from './views/action/action.component';
import { EditActionComponent } from './views/editaction/editaction.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { OrderComponent } from './views/order/order.component';
import { OrdersComponent } from './views/orders/orders.component';
import { PersonpickerComponent } from './components/personpicker/personpicker.component';
import { environment } from '../environments/environment';
import { NotAcceptedComponent } from './views/not-accepted/not-accepted.component';
import { UserQueueComponent } from './views/userqueue/userqueue.component';
import { MyOrdersComponent } from './views/myorders/myorders.component';
import { DateHelper } from './helpers/date.helper';
import { PriceHelper, PricePipe, PriceValidatorDirective } from './helpers/price.helper';
import { ProductFieldModalComponent } from './components/product-field-modal/product-field-modal.component';
import { ProductEditorModalComponent } from './components/product-editor-modal/product-editor-modal.component';
import { ActionFormAdapter } from './helpers/action.adapter';
import { ImportProductsModalComponent } from './components/import-products-modal/import-products-modal.component';
import { SingleActionViewComponent } from './views/single-action-view/single-action-view.component';
import { MsgComponent } from './msg/msg.component';
import { ProductFieldHelper } from './helpers/productfield.helper';
import { FormInputComponent } from './views/editaction/components/forminput.component';
import { HelpersEditorComponent } from './views/editaction/components/helpers.component';
import { ProductsEditorComponent } from './views/editaction/components/products.components';

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
    MsgComponent,
    FormInputComponent,
    HelpersEditorComponent,
    ProductsEditorComponent
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
    ProductFieldHelper,
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

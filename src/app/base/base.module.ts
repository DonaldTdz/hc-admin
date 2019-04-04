import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomerComponent } from './customer/customer.component';
import { BaseRoutingModule } from './base-routing.module';
import { LayoutModule } from '@layout/layout.module';
import { CreateCustomerMessageComponent } from './customer/create-customer-message/create-customer-message.component';
import { EditCustomerMessageComponent } from './customer/edit-customer-message/edit-customer-message.component';
import { CustomerService } from 'services';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BaseRoutingModule,
    LayoutModule,
    SharedModule
  ],
  declarations: [
    CustomerComponent,
    CreateCustomerMessageComponent,
    EditCustomerMessageComponent],
  providers: [
    CustomerService
  ],
  entryComponents: [
    CustomerComponent,
    CreateCustomerMessageComponent,
    EditCustomerMessageComponent
  ]
}
)
export class BaseModule { }

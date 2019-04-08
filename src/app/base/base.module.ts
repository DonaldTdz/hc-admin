import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomerComponent } from './customer/customer.component';
import { BaseRoutingModule } from './base-routing.module';
import { LayoutModule } from '@layout/layout.module';
import { CreateCustomerComponent } from './customer/create-customer/create-customer.component';
import { EditCustomerComponent } from './customer/edit-customer/edit-customer.component';
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
    CreateCustomerComponent,
    EditCustomerComponent],
  providers: [
    CustomerService
  ],
  entryComponents: [
    CustomerComponent,
    CreateCustomerComponent,
    EditCustomerComponent
  ]
}
)
export class BaseModule { }

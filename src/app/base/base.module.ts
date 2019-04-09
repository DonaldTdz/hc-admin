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
import { CustomerService, CompanyAccountService, CompanyService } from 'services';
import { CompanyComponent } from './company/company.component';
import { CreateCompanyAccountComponent } from './company/create-company-account/create-company-account.component';


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
    EditCustomerMessageComponent,
    CompanyComponent,
    CreateCompanyAccountComponent
  ],
  entryComponents: [
    CustomerComponent,
    CreateCustomerMessageComponent,
    EditCustomerMessageComponent,
    CompanyComponent,
    CreateCompanyAccountComponent
  ],
  providers: [
    CustomerService, CompanyAccountService, CompanyService
  ]
}
)
export class BaseModule { }

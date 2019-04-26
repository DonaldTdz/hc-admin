import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ProjectService, CustomerService, EmployeeServiceProxy, DataDictionaryService, ProjectDetailService, ProductService, TenderService, PurchaseService
  , ContractService, ContractDetailService, InvoiceService, InvoiceDetailService
} from 'services'

import { PmRoutingModule } from './pm-routing.module';
import { ProjectComponent } from './project/project.component';
import { CreateOrUpdateProjectComponent } from './project/create-or-update-project/create-or-update-project.component';
import { DetailProjectComponent } from './project/detail-project/detail-project.component';
import { CreateOrUpdateProjectdetailComponent } from './project/create-or-update-projectdetail/create-or-update-projectdetail.component';
import { TenderComponent } from './tender/tender.component';
import { CreateOrUpdateTenderComponent } from './tender/create-or-update-tender/create-or-update-tender.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { CreateOrUpdatePurchaseComponent } from './purchase/create-or-update-purchase/create-or-update-purchase.component';
import { DetailPurchaseComponent } from './purchase/detail-purchase/detail-purchase.component';
import { CreateOrUpdatePurchasedetailComponent } from './purchase/create-or-update-purchasedetail/create-or-update-purchasedetail.component';
import { DetailTenderComponent } from './tender/detail-tender/detail-tender.component';
import { ContractComponent } from './contract/contract.component';
import { CreateOrUpdateContractComponent } from './contract/create-or-update-contract/create-or-update-contract.component';
import { DetailContractComponent } from './contract/detail-contract/detail-contract.component';
import { CreateOrUpdateContractdetailComponent } from './contract/create-or-update-contractdetail/create-or-update-contractdetail.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CreateOrUpdateInvoiceComponent } from './invoice/create-or-update-invoice/create-or-update-invoice.component';
import { DetailInvoiceComponent } from './invoice/detail-invoice/detail-invoice.component';
import { CreateOrUpdateInvoicedetailComponent } from './invoice/create-or-update-invoicedetail/create-or-update-invoicedetail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    ReactiveFormsModule,
    PmRoutingModule
  ],
  declarations: [
    ProjectComponent,
    CreateOrUpdateProjectComponent,
    DetailProjectComponent,
    CreateOrUpdateProjectdetailComponent,
    TenderComponent,
    CreateOrUpdateTenderComponent,
    PurchaseComponent,
    CreateOrUpdatePurchaseComponent,
    DetailPurchaseComponent,
    CreateOrUpdatePurchasedetailComponent,
    DetailTenderComponent,
    ContractComponent,
    CreateOrUpdateContractComponent,
    DetailContractComponent,
    CreateOrUpdateContractdetailComponent,
    InvoiceComponent,
    CreateOrUpdateInvoiceComponent,
    DetailInvoiceComponent,
    CreateOrUpdateInvoicedetailComponent,
  ],
  entryComponents: [
    CreateOrUpdateProjectComponent,
    DetailProjectComponent,
    CreateOrUpdateProjectdetailComponent,
    CreateOrUpdateTenderComponent,
    CreateOrUpdatePurchaseComponent,
    CreateOrUpdatePurchasedetailComponent,
    CreateOrUpdateContractComponent,
    CreateOrUpdateContractdetailComponent,
    CreateOrUpdateInvoiceComponent,
    CreateOrUpdateInvoicedetailComponent

  ],
  providers: [ProjectService, CustomerService, EmployeeServiceProxy, DataDictionaryService, ProjectDetailService, ProductService, TenderService
    , PurchaseService, ContractService, ContractDetailService, InvoiceService, InvoiceDetailService]
})
export class PmModule { }
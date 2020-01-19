import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ProjectService, CustomerService, EmployeeServiceProxy, DataDictionaryService, ProjectDetailService,
  ProductService, TenderService, PurchaseService, ContractService, InvoiceService,
  InvoiceDetailService, TimesheetService, PurchaseDetailService,
  PaymentPlanService
} from 'services';

import { PmRoutingModule } from './pm-routing.module';
import { ProjectComponent } from './project/project.component';
import { DetailProjectComponent } from './project/detail-project/detail-project.component'
import { ModifyProjectdetailComponent } from './project/modify-projectdetail/modify-projectdetail.component';
import { TenderComponent } from './tender/tender.component';
import { CreateTenderDataComponent } from './tender/create-tenderdata/create-tenderdata.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { CreatePurchaseComponent } from './purchase/create-purchase/create-purchase.component';
import { DetailPurchaseComponent } from './purchase/detail-purchase/detail-purchase.component';
import { DetailTenderComponent } from './tender/detail-tender/detail-tender.component';
import { ContractComponent } from './contract/contract.component';
import { CreateOrUpdateContractComponent } from './contract/create-or-update-contract/create-or-update-contract.component';
import { CreateOrUpdateContractdetailComponent } from './contract/create-or-update-contractdetail/create-or-update-contractdetail.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CreateOrUpdateInvoiceComponent } from './invoice/create-or-update-invoice/create-or-update-invoice.component';
import { DetailInvoiceComponent } from './invoice/detail-invoice/detail-invoice.component';
import { CreateOrUpdateInvoicedetailComponent } from './invoice/create-or-update-invoicedetail/create-or-update-invoicedetail.component';
import { ReimburseComponent } from './reimburse/reimburse.component';
import { DetailReimburseComponent } from './reimburse/detail-reimburse/detail-reimburse.component';
import { PaymentplanComponent } from './paymentplan/paymentplan.component';
import { CreatePaymentplanComponent } from './paymentplan/create-paymentplan/create-paymentplan.component';
import { UpdatePaymentplanComponent } from './paymentplan/update-paymentplan/update-paymentplan.component';
import { ModifyReimburseComponent } from './reimburse/modify-reimburse/modify-reimburse.component';
import { ModifyProjectComponent } from './project/modify-project/modify-project.component';
import { FileComponent } from './file/file.component';
import { ModifContractdetailComponent } from './contract/modif-contractdetail/modif-contractdetail.component';
import { ModifyReimburseDetailComponent } from './reimburse/modify-reimbursedetail/modify-reimbursedetail.component';
import { AdvancepaymentComponent } from './advancepayment/advancepayment.component';
import { AdvancepaymentDetailComponent } from './advancepayment/advancepayment-detail/advancepayment-detail.component';
import { CreateOrUpdatePurchasedetailComponent } from './purchase/create-or-update-purchasedetail/create-or-update-purchasedetail.component';
import { DetailComponent } from './project/detail/detail.component';
import { SaleProjectComponent } from './project/sale-project/sale-project.component';
import { SaleDetailComponent } from './project/sale-detail/sale-detail.component';
import { NewProjectComponent } from './project/new-project/new-project.component';
import { ExamineComponent } from './examine/examine.component';
import { ProjectSearchComponent } from './purchase/project-search/project-search.component';
import { WorkloadComponent } from './workload/workload.component';

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
    NewProjectComponent,
    SaleProjectComponent,
    DetailProjectComponent,
    SaleDetailComponent,
    DetailComponent,
    ModifyProjectdetailComponent,
    TenderComponent,
    CreateTenderDataComponent,
    PurchaseComponent,
    CreatePurchaseComponent,
    DetailPurchaseComponent,
    CreateOrUpdatePurchasedetailComponent,
    DetailTenderComponent,
    ContractComponent,
    CreateOrUpdateContractComponent,
    CreateOrUpdateContractdetailComponent,
    InvoiceComponent,
    CreateOrUpdateInvoiceComponent,
    DetailInvoiceComponent,
    CreateOrUpdateInvoicedetailComponent,
    ReimburseComponent,
    DetailReimburseComponent,
    PaymentplanComponent,
    CreatePaymentplanComponent,
    UpdatePaymentplanComponent,
    ModifyReimburseComponent,
    ModifyProjectComponent,
    FileComponent,
    ModifContractdetailComponent,
    ModifyReimburseDetailComponent,
    AdvancepaymentComponent,
    AdvancepaymentDetailComponent,
    ExamineComponent,
    ProjectSearchComponent,
    WorkloadComponent,
  ],
  entryComponents: [
    DetailProjectComponent,
    ModifyProjectdetailComponent,
    CreateTenderDataComponent,
    CreateOrUpdateContractComponent,
    CreateOrUpdateContractdetailComponent,
    CreateOrUpdatePurchasedetailComponent,
    CreateOrUpdateInvoiceComponent,
    CreateOrUpdateInvoicedetailComponent,
    CreatePaymentplanComponent,
    UpdatePaymentplanComponent,
    FileComponent,
    ModifContractdetailComponent,
    ModifyReimburseDetailComponent,
    AdvancepaymentDetailComponent,
    ModifyReimburseComponent,
    ProjectSearchComponent
  ],
  providers: [ProjectService, CustomerService, EmployeeServiceProxy, DataDictionaryService,
    ProjectDetailService, ProductService, TenderService, PurchaseService, ContractService,
    PurchaseDetailService, InvoiceService, InvoiceDetailService, TimesheetService, PaymentPlanService
  ],
}
)
export class PmModule { }

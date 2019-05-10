import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project/project.component'
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { DetailProjectComponent } from './project/detail-project/detail-project.component'
import { TenderComponent } from './tender/tender.component'
import { PurchaseComponent } from './purchase/purchase.component'
import { DetailPurchaseComponent } from './purchase/detail-purchase/detail-purchase.component'
import { DetailTenderComponent } from './tender/detail-tender/detail-tender.component'
import { ContractComponent } from './contract/contract.component'
import { DetailContractComponent } from './contract/detail-contract/detail-contract.component'
import { InvoiceComponent } from './invoice/invoice.component'
import { DetailInvoiceComponent } from './invoice/detail-invoice/detail-invoice.component'
import { ReimburseComponent } from './reimburse/reimburse.component'
import { DetailReimburseComponent } from './reimburse/detail-reimburse/detail-reimburse.component'
import { TimesheetComponent } from './timesheet/timesheet.component'
import { PaymentplanComponent } from './paymentplan/paymentplan.component'

const routes: Routes = [
  {
    path: 'project',
    component: ProjectComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: 'dprojectoc-detail',
    component: DetailProjectComponent,
    canActivate: [AppRouteGuard],
    data: { title: "项目详情" }
  }, {
    path: 'tender',
    component: TenderComponent,
    canActivate: [AppRouteGuard],
  }, {
    path: 'purchase',
    component: PurchaseComponent,
    canActivate: [AppRouteGuard],
  }, {
    path: 'purchase-detail',
    component: DetailPurchaseComponent,
    canActivate: [AppRouteGuard],
    data: { title: "采购详情" }
  },
  {
    path: 'tender-detail',
    component: DetailTenderComponent,
    canActivate: [AppRouteGuard],
    data: { title: "招标详情" }
  },
  {
    path: 'contract',
    component: ContractComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: 'contract-detail',
    component: DetailContractComponent,
    canActivate: [AppRouteGuard],
    data: { title: "合同详情" }
  },
  {
    path: 'invoice',
    component: InvoiceComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: 'invoice-detail',
    component: DetailInvoiceComponent,
    canActivate: [AppRouteGuard],
    data: { title: "发票详情" }
  },
  {
    path: 'reimburse',
    component: ReimburseComponent,
    canActivate: [AppRouteGuard],
  }, {
    path: 'reimburse-detail',
    component: DetailReimburseComponent,
    canActivate: [AppRouteGuard],
    data: { title: "报销详情" }
  },
  {
    path: 'timesheet',
    component: TimesheetComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: 'paymentplan',
    component: PaymentplanComponent,
    canActivate: [AppRouteGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmRoutingModule { }

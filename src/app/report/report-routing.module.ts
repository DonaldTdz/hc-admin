import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import { InvoicestatisticsComponent } from './invoicestatistics/invoicestatistics.component';
import { AccountsreceivableComponent } from './accountsreceivable/accountsreceivable.component';
import { AccountsreceivableDetailComponent } from './accountsreceivable/accountsreceivable-detail/accountsreceivable-detail.component';
import { ProfitstatisticComponent } from './profitstatistic/profitstatistic.component';
import { TimesheetstatisticComponent } from './timesheetstatistic/timesheetstatistic.component';
import { AccountspayableComponent } from './accountspayable/accountspayable.component';
import { AccountspayableDetailComponent } from './accountspayable/accountspayable-detail/accountspayable-detail.component';

import { AppRouteGuard } from '@shared/auth';

const routes: Routes = [
  {
    path: 'invoicestatistics',
    component: InvoicestatisticsComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ['GeneralManager', 'Finance'] },
  },
  {
    path: 'accountsreceivable',
    component: AccountsreceivableComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ['GeneralManager', 'Finance'] },
  },
  {
    path: 'accountsreceivable-detail',
    component: AccountsreceivableDetailComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ['GeneralManager', 'Finance'] },
  },
  {
    path: 'profitstatistic',
    component: ProfitstatisticComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ['GeneralManager', 'Finance'] },
  },
  {
    path: 'timesheetstatistic',
    component: TimesheetstatisticComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ['GeneralManager', 'Finance'] },
  },
  {
    path: 'accountspayable',
    component: AccountspayableComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ['GeneralManager', 'Finance'] },
  },
  {
    path: 'accountspayable-detail',
    component: AccountspayableDetailComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ['GeneralManager', 'Finance'] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }

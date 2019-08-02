import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import { InvoicestatisticsComponent } from './invoicestatistics/invoicestatistics.component'
import { AppRouteGuard } from '@shared/auth';

const routes: Routes = [
  {
    path: 'invoicestatistics',
    component: InvoicestatisticsComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ['GeneralManager', 'Finance'] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }

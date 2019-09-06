import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { InvoicestatisticsComponent } from './invoicestatistics/invoicestatistics.component';
import { ReportServices, ProjectService } from 'services'
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@layout/layout.module';
import { AccountsreceivableComponent } from './accountsreceivable/accountsreceivable.component';
import { AccountsreceivableDetailComponent } from './accountsreceivable/accountsreceivable-detail/accountsreceivable-detail.component';
import { ProfitstatisticComponent } from './profitstatistic/profitstatistic.component';
import { TimesheetstatisticComponent } from './timesheetstatistic/timesheetstatistic.component';
import { AccountspayableComponent } from './accountspayable/accountspayable.component';
import { AccountspayableDetailComponent } from './accountspayable/accountspayable-detail/accountspayable-detail.component';
import { SalesdetailComponent } from './salesdetail/salesdetail.component';
import { ProjectprofitComponent } from './projectprofit/projectprofit.component';
import { AccountanalysisComponent } from './accountanalysis/accountanalysis.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    ReactiveFormsModule,
    ReportRoutingModule
  ],

  declarations: [InvoicestatisticsComponent,
    AccountsreceivableComponent,
    AccountsreceivableDetailComponent,
    ProfitstatisticComponent,
    TimesheetstatisticComponent,
    AccountspayableComponent,
    AccountspayableDetailComponent,
    SalesdetailComponent,
    ProjectprofitComponent,
    AccountanalysisComponent],
  providers: [ReportServices, ProjectService],
})
export class ReportModule { }

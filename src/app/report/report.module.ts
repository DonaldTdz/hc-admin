import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { InvoicestatisticsComponent } from './invoicestatistics/invoicestatistics.component';
import { ReportServices } from 'services'
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@layout/layout.module';
import { AccountsreceivableComponent } from './accountsreceivable/accountsreceivable.component';

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

  declarations: [InvoicestatisticsComponent, AccountsreceivableComponent],
  providers: [ReportServices],
})
export class ReportModule { }

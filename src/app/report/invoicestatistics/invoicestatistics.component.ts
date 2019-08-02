import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ReportServices } from 'services'
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';

var nowDate = new Date();
@Component({
  selector: 'app-invoicestatistics',
  templateUrl: './invoicestatistics.component.html',
  styles: []
})
export class InvoicestatisticsComponent extends AppComponentBase implements OnInit {
  types = [{ text: '销项', value: 1 }, { text: '进项', value: 2 }];
  search: any = {};
  loading = false;

  constructor(injector: Injector, private reportServices: ReportServices) { super(injector); }

  ngOnInit() {
    this.search.type = 1;
    this.search.submitDate = nowDate;
    this.getInvoiceStatistics();
  }

  getInvoiceStatistics() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.Type = this.search.type;
    params.SubmitDate = this.search.submitDate;
    this.reportServices.getInvoiceStatistics(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  refresh() {
    this.search.type = 1;
    this.search.submitDate = new Date();
    this.query.pageIndex = 1;
  }

}

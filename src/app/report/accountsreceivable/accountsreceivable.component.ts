import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ReportServices, CustomerService } from 'services';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';

@Component({
  selector: 'app-accountsreceivable',
  templateUrl: './accountsreceivable.component.html',
  providers: [CustomerService],
  styleUrls: ["./accountsreceivable.component.scss"]
})
export class AccountsreceivableComponent extends AppComponentBase implements OnInit {
  customers = [];
  search: any = {};
  loading = false;

  constructor(injector: Injector, private reportServices: ReportServices
    , private customerService: CustomerService) { super(injector); }

  ngOnInit() {
    this.getCustomerList();
    this.getAccountsReceivables();
  }

  //获取客户下拉列表
  getCustomerList() {
    this.customerService.getDropDownDtos().subscribe((result) => {
      this.customers = result;
    });
  }

  //获取应收账款
  getAccountsReceivables() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.CustomerId = this.search.customerId;
    this.reportServices.getAccountsReceivable(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  refresh() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getAccountsReceivables();
  }

}

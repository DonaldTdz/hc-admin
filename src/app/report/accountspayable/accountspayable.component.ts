import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ReportServices, SupplierService } from 'services';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';

@Component({
  selector: 'app-accountspayable',
  templateUrl: './accountspayable.component.html',
  styleUrls: ["./accountspayable.component.scss"],
  providers: [SupplierService]
})
export class AccountspayableComponent extends AppComponentBase implements OnInit {
  suppliers = [];
  search: any = {};
  loading = false;

  constructor(injector: Injector, private reportServices: ReportServices
    , private supplierService: SupplierService) { super(injector); }

  ngOnInit() {
    this.getCustomerList();
    this.getAccountsPayable();
  }

  //获取供应商下拉列表
  getCustomerList() {
    this.supplierService.getDropDownDtos().subscribe((result) => {
      this.suppliers = result;
    });
  }

  //获取应付账款
  getAccountsPayable() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.SupplierId = this.search.supplierId;
    this.reportServices.getAccountsPayable(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  refresh() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getAccountsPayable();
  }

}
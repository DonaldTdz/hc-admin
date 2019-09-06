import { Component, OnInit, Injector } from '@angular/core';
import { ReportServices, SupplierService, CustomerService } from 'services';
import { PagedResultNewDto } from '@shared/component-base/paged-listing-component-base';

@Component({
  selector: 'app-accountanalysis',
  templateUrl: './accountanalysis.component.html',
  styleUrls: ['./accountanalysis.component.scss'],
  providers: [SupplierService, CustomerService]
})
export class AccountanalysisComponent implements OnInit {
  refs = [];
  search: any = {};
  items: any = [];
  planTimes: any;
  types = [{ text: '应收', value: 1 }, { text: '应付', value: 2 }]

  loading = false;

  constructor(injector: Injector, private reportServices: ReportServices,
    private supplierService: SupplierService, private customerService: CustomerService) { }

  ngOnInit() {
    this.search.type = 1;
    this.getCustomerList();
    this.getAccountAnalyses();
  }

  /**账款类型选中回调 */
  getRefs() {
    if (this.search.type === 1)
      this.getCustomerList();
    else
      this.getSupplierList();
  }

  //获取供应商下拉列表
  getSupplierList() {
    this.supplierService.getDropDownDtos().subscribe((result) => {
      this.refs = result;
    });
  }

  //获取客户下拉列表
  getCustomerList() {
    this.customerService.getDropDownDtos().subscribe((result) => {
      this.refs = result;
    });
  }

  //获取账款统计
  getAccountAnalyses() {
    this.loading = true;
    let params: any = {};
    params.Type = this.search.type;
    params.RefId = this.search.refId;
    this.reportServices.getAccountAnalysesAsync(params).subscribe((result: PagedResultNewDto<any>) => {
      this.loading = false;
      this.items = result.items;
      this.planTimes = result.common;
    })
  }

  refresh() {
    this.search = {};
    this.getAccountAnalyses();
  }

}
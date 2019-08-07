import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ReportServices, ProductService } from 'services'
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accountspayable-detail',
  templateUrl: './accountspayable-detail.component.html',
  styleUrls: ['./accountspayable-detail.component.scss'],
  providers: [ProductService]
})
export class AccountspayableDetailComponent extends AppComponentBase implements OnInit {
  products = [];
  search: any = {};
  loading = false;
  supplierId: number;

  constructor(injector: Injector, private reportServices: ReportServices
    , private productService: ProductService, private actRouter: ActivatedRoute) {
    super(injector);
    this.supplierId = this.actRouter.snapshot.queryParams['id'];
  }

  ngOnInit() {
    this.getProducts();
    this.getSupplierPayableDetail();
  }

  //获取产品下拉列表
  getProducts() {
    this.productService.getDropDownDtos().subscribe((result) => {
      this.products = result;
    });
  }

  //获取供应商应付账款详情
  getSupplierPayableDetail() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.SupplierId = this.supplierId;
    params.ProductId = this.search.productId;
    this.reportServices.getSupplierPayableDetail(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  refresh() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getSupplierPayableDetail();
  }

  //返回
  return() {
    history.back();
  }

}

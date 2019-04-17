import { Component, OnInit, Injector } from '@angular/core';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { ProductService } from 'services'
import { AppComponentBase } from '@shared/app-component-base';
import { ModalComponentBase } from '@shared/component-base';
import { Product } from 'entities'

@Component({
  selector: 'app-selection-product',
  templateUrl: './selection-product.component.html',
  styles: []
})
export class SelectionProductComponent extends ModalComponentBase implements OnInit {

  search: any = {};
  query: any = {
    pageIndex: 1,
    pageSize: 10,
    skipCount: function () { return (this.pageIndex - 1) * this.pageSize; },
    total: 0,
  };
  constructor(injector: Injector, private productService: ProductService) {
    super(injector);
  }
  ngOnInit() {
    this.getProductList();
  }

  //查询
  getProductList() {
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.Name = this.search.name;
    params.IsEnabled = this.search.IsEnabled;
    this.productService.getAll(params).subscribe((result: PagedResultDto) => {
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  selection(item: Product) {
    this.success(item);
  }

  refresh() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getProductList();
  }

}

import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { STComponent, STColumn, STChange, STPage } from '@delon/abc';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { ProductService, InventoryFlowService } from 'services';
import { Product, InventoryFlow } from 'entities';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase, } from '@shared/app-component-base';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styles: []
})
export class DetailProductComponent extends AppComponentBase implements OnInit {
  id: any = '';
  loading = false;
  product: Product = new Product();
  attachments = [];
  pages: STPage = {
    total: true,//分页显示多少条数据，字符串型
    show: true,//显示分页
    front: false, //关闭前端分页，true是前端分页，false后端控制分页
    showSize: true,
    pageSizes: [10, 20, 30, 40]
  };
  @ViewChild('st')
  st: STComponent;
  columns: STColumn[] = [
    { title: '类型', index: 'typeName' },
    { title: '期初库存', index: 'initial', type: 'number' },
    { title: '发生库存', index: 'streamNumber', type: 'number' },
    { title: '期末库存', index: 'ending', type: 'number' },
    { title: '描述', index: 'desc' },
    { title: '创建时间', index: 'creationTime', type: 'date' },
  ];
  constructor(injector: Injector, private productService: ProductService, private actRouter: ActivatedRoute
    , private inventoryFlowService: InventoryFlowService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.getProducts();
    this.getInventoryFlows();
  }

  //获取product数据
  getProducts() {
    this.productService.getById(this.id.toString()).subscribe((result) => {
      this.product = result;
    });
  }

  //查询报销明细
  getInventoryFlows() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = (this.st.pi - 1) * this.st.ps;
    params.MaxResultCount = this.st.ps;
    params.ProductId = this.id;
    this.inventoryFlowService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }


  stChange(e: STChange) {
    switch (e.type) {
      case 'pi':
        this.getInventoryFlows();
        break;
      case 'ps':
        this.getInventoryFlows();
        break;
    }
  }

  //返回
  return() {
    history.back();
  }

}

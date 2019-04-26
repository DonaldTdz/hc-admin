import { Component, OnInit, Injector } from '@angular/core';
import { Supplier } from 'entities'
import { SupplierService } from 'services'
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
@Component({
  selector: 'app-detail-supplier',
  templateUrl: './detail-supplier.component.html',
  styles: []
})
export class DetailSupplierComponent extends AppComponentBase implements OnInit {
  id: any = '';
  loading = false;
  supplier: Supplier = new Supplier();
  attachments = [];
  constructor(injector: Injector, private supplierService: SupplierService, private actRouter: ActivatedRoute, private router: Router) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.getData();
    this.getPurchaseProducts();
  }


  //获取contract数据
  getData() {
    this.supplierService.GetById(this.id.toString()).subscribe((result) => {
      this.supplier = result;
      this.jointAttachments();
    });
  }

  //跳转到采购单
  skipPurchase(id: any) {
    this.router.navigate(['/app/pm/purchase', { id: id }]);
  }

  //处理附件
  jointAttachments() {
    if (this.supplier.attachments) {
      let items = this.supplier.attachments.split(",");
      let arr = [];
      for (let item of items) {
        let fileName = item.split(":")[0];
        let fileUrl = item.split(":")[1];
        let map = { "fileName": fileName, "fileUrl": fileUrl };
        arr.push(map);
      }
      this.attachments = arr;
    } else {
      this.attachments = []
    }
  }

  //查看所属采购产品
  getPurchaseProducts() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.Id = this.id;
    this.supplierService.getPurchaseProductList(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }
  //返回
  return() {
    history.back();
  }

}

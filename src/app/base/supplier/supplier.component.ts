import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SupplierService } from 'services'
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { Supplier } from 'entities'
import { CreateOrUpdateSupplierComponent } from './create-or-update-supplier/create-or-update-supplier.component'
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styles: []
})
export class SupplierComponent extends AppComponentBase implements OnInit {
  search: any = {};
  supplier: Supplier = new Supplier();
  tableLoading = "false"
  constructor(injector: Injector, private supplierService: SupplierService, private router: Router) {
    super(injector);
  }

  ngOnInit() {
    this.getSuppliers();
  }

  delete(entity: Supplier) {
    this.message.confirm(
      "是否删除该供应商:'" + entity.name + "'?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.supplierService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getSuppliers();
          });
        }
      }
    )
  }

  //编辑
  editDing(id: number) {
    this.modalHelper.open(CreateOrUpdateSupplierComponent, { id: id }, 'lg', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(isSave => {
      if (isSave) {
        this.refreshData();
      }
    });
  }

  //新增
  create() {
    this.modalHelper.open(CreateOrUpdateSupplierComponent, {}, 'lg', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(isSave => {
      if (isSave) {
        this.refreshData();
      }
    });
  }

  //查询
  getSuppliers() {

    this.tableLoading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.Name = this.search.name;
    this.supplierService.getAll(params).subscribe((result: PagedResultDto) => {
      this.tableLoading = "false"
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  //详细
  details(id: any) {
    this.router.navigate(['/app/base/supplier-detail', { id: id }]);
  }

  //重置
  refreshData() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getSuppliers();
  }

}

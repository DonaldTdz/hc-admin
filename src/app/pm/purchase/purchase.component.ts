import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase, } from '@shared/app-component-base';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { PurchaseService, ProjectService, EmployeeServiceProxy } from 'services'
import { Purchase } from 'entities'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styles: []
})
export class PurchaseComponent extends AppComponentBase implements OnInit {
  loading = "false";
  employees = [];
  search: any = {};
  id: any = '';
  constructor(injector: Injector, private purchaseService: PurchaseService, private projectService: ProjectService, private employeeServiceProxy: EmployeeServiceProxy
    , private router: Router, private actRouter: ActivatedRoute) { super(injector); this.id = this.actRouter.snapshot.queryParams['id']; }

  ngOnInit() {
    this.getPurchase();
    this.getEmployees();
  }

  //查询
  getPurchase() {
    this.loading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.EmployeeId = this.search.employeeId;
    params.Code = this.search.code;
    this.purchaseService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = "false"
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  //获取负责人下拉列表
  getEmployees() {
    this.employeeServiceProxy.getDropDownDtos().subscribe((result) => {
      this.employees = result;
    })
  }

  //详细
  details(id: any) {
    this.router.navigate(['/app/pm/purchase-detail', { id: id }]);
  }

  //新增
  create() {
    this.router.navigate(['/app/pm/create-purchase']);
  }


  //删除
  delete(entity: Purchase) {
    this.message.confirm(
      "是否删除该采购:'" + entity.code + "'?(请谨慎删除,如该采购下面有其他功能正在使用,可能会出现无法正常使用的情况)",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.purchaseService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getPurchase();
          });
        }
      }
    )
  }

  refreshData() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getPurchase();
  }


}

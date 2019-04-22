import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase, } from '@shared/app-component-base';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { PurchaseService, ProjectService, EmployeeServiceProxy } from 'services'
import { Purchase } from 'entities'
import { Router } from '@angular/router';
import { CreateOrUpdatePurchaseComponent } from './create-or-update-purchase/create-or-update-purchase.component'

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styles: []
})
export class PurchaseComponent extends AppComponentBase implements OnInit {
  projectList: any;
  tableLoading = "false";
  search: any = {};
  constructor(injector: Injector, private purchaseService: PurchaseService, private projectService: ProjectService, private employeeServiceProxy: EmployeeServiceProxy
    , private router: Router) { super(injector); }

  ngOnInit() {
    this.getPurchase();
    this.getProjects();
  }

  //查询
  getPurchase() {
    this.tableLoading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.ProjectId = this.search.projectId;
    params.Code = this.search.code;
    this.purchaseService.getAll(params).subscribe((result: PagedResultDto) => {
      this.tableLoading = "false"
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  //获取所属项目下拉列表
  getProjects() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projectList = result;
    })
  }

  //编辑
  editDing(id: any) {
    console.log(id);
    this.modalHelper.open(CreateOrUpdatePurchaseComponent, { id: id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refreshData();
      }
    });
  }

  //详细
  details(id: any) {
    this.router.navigate(['/app/pm/purchase-detail', { id: id }]);
  }

  //新增
  create() {
    this.modalHelper.open(CreateOrUpdatePurchaseComponent, {}, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refreshData();
      }
    });
  }


  //删除
  delete(entity: Purchase) {
    this.message.confirm(
      "是否删除该采购:'" + entity.code + "'?",
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

import { Component, OnInit, Injector } from '@angular/core';
import { Project } from 'entities'
import { ProjectService, CustomerService } from 'services'
import { AppComponentBase } from '@shared/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styles: []
})
export class ProjectComponent extends AppComponentBase implements OnInit {
  projectMode = [{ text: "内部", value: 1 }, { text: "合伙", value: 2 }, { text: "外部", value: 3 }];
  projectStatus = [{ "text": "立项", "value": 1 }
    , { text: "招标", value: 2 }
    , { text: "合同", value: 3 }
    , { text: "收款", value: 4 }
    , { text: "已完成", value: 5 }
    , { text: "丢单", value: 6 }];
  search: any = {};
  customerList: any;
  id: any = '';
  project: Project = new Project();
  loading = "false"
  constructor(injector: Injector, private router: Router, private projectService: ProjectService, private customerService: CustomerService, private actRouter: ActivatedRoute) {
    super(injector);
    this.id = this.actRouter.snapshot.queryParams['id'];
  }

  ngOnInit() {
    this.getProjects();
    this.getCustomerList();
  }

  //查询
  getProjects() {
    this.loading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.Name = this.search.name;
    params.Status = this.search.status;
    params.customerId = this.search.customerId;
    params.Id = this.id;
    this.projectService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = "false"
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  getCustomerList() {
    this.customerService.getDropDownDtos().subscribe((result) => {
      this.customerList = result;
    });
  }

  //编辑
  // editDing(id: any) {
  //   console.log(id)
  //   this.modalHelper.open(CreateOrUpdateProjectComponent, { id: id }, 'lg', {
  //     nzMask: true
  //   }).subscribe(isSave => {
  //     if (isSave) {
  //       this.getProjects();
  //     }
  //   });
  // } 

  //详细
  details(id: any, status: number) {
    this.router.navigate(['/app/pm/projectoc-detail', { id: id }]);
  }

  //新增
  create() {
    // this.modalHelper.open(CreateOrUpdateProjectComponent, {}, 'lg', {
    //   nzMask: true
    // }).subscribe(isSave => {
    //   if (isSave) {
    //     this.getProjects();
    //   }
    // });
    this.router.navigate(['/app/pm/modify-project']);
  }

  //删除
  delete(entity: Project) {
    this.message.confirm(
      "是否删除该项目:'" + entity.name + "'?(请谨慎删除,如该项目下面有其他功能正在使用,可能会出现无法正常使用的情况)",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.projectService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getProjects();
          });
        }
      }
    )
  }

  //重置
  refreshData() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getProjects();
  }

}

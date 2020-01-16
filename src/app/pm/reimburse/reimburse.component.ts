import { Component, OnInit, Injector, Input } from '@angular/core';
import { PagedResultNewDto } from '@shared/component-base/paged-listing-component-base';
import { ReimburseService, ProjectService, EmployeeServiceProxy } from 'services'
import { Router } from '@angular/router';
import { AppComponentBase, } from '@shared/app-component-base';
import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-reimburse',
  templateUrl: './reimburse.component.html',
  providers: [ReimburseService]
})
export class ReimburseComponent extends AppComponentBase implements OnInit {
  search: any = {};
  expandForm = false;
  loading = false;
  TotalAmount: number;
  projects: any;
  employees: any;
  statuss = [{ text: '提交', value: 1 }, { text: '审批通过', value: 2 }, { text: '拒绝', value: 3 }, { text: '取消', value: 4 }, { text: '草稿', value: 0 }];
  types = [{ text: '项目型报销', value: 1 }, { text: '非项目报销', value: 2 }];
  grantStatuss = [{ text: '已发放', value: "true" }, { text: '未发放', value: "false" }];
  constructor(injector: Injector, private reimburseService: ReimburseService, private projectService: ProjectService
    , private router: Router, private employeeService: EmployeeServiceProxy, private nzMsg: NzMessageService) { super(injector); }

  ngOnInit() {
    this.search.type = 1;
    this.getReimburses();
    this.getProjects();
    this.getEmployees();
  }

  //获取所属员工下拉列表
  getEmployees() {
    this.employeeService.getDropDownDtos().subscribe((result) => {
      this.employees = result;
    })
  }

  //获取所属项目下拉列表
  getProjects() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projects = result;
    })
  }

  getReimburses() {
    this.loading = true;
    if (!this.search.type)
      this.search.type = 1;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.ProjectId = this.search.projectId;
    params.Status = this.search.status;
    params.Type = this.search.type;
    params.EmployeeId = this.search.employeeId;
    params.SubmitDate = this.search.submitDate;
    params.GrantStatus = this.search.grantStatus;
    this.reimburseService.getAll(params).subscribe((result: PagedResultNewDto<number>) => {
      this.loading = false;
      this.query.data = result.items;
      this.TotalAmount = result.common;
      this.query.total = result.totalCount;
    })
  }

  //详情
  details(id: any) {
    this.router.navigate(['/app/pm/reimburse-detail', { id: id }]);
  }

  //编辑
  edit(id: any) {
    this.router.navigate(['/app/pm/create-reimburse', { reimburseId: id }]);
  }

  //新增
  create() {
    this.router.navigate(['/app/pm/create-reimburse']);
  }

  delete(id: string) {
    this.message.confirm(
      "确认删除该报销??",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.reimburseService.delete(id).subscribe((totalAmount: number) => {
            this.nzMsg.success('删除成功！');
            this.getReimburses();
          });
        }
      }
    )
  }

  //修改发放状态
  clickSwitch(id: string, grantStatus: boolean): void {
    this.reimburseService.modifyGrantStatus(id, grantStatus).subscribe((ret: boolean) => {
      this.nzMsg.success('修改发放状态成功');
    });
  }


  refresh() {
    this.search = {};
    this.query.pageIndex = 1;
    // this.getReimburse();
  }
}

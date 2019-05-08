import { Component, OnInit, Injector, Input } from '@angular/core';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { ReimburseService, ProjectService, EmployeeServiceProxy } from 'services'
import { Router } from '@angular/router';
import { AppComponentBase, } from '@shared/app-component-base';


@Component({
  selector: 'app-reimburse',
  templateUrl: './reimburse.component.html',
  styles: []
})
export class ReimburseComponent extends AppComponentBase implements OnInit {
  @Input() projectId;
  search: any = {};
  loading = false;
  projects: any;
  employees: any;
  statuss = [{ text: '提交', value: 1 }, { text: '审批通过', value: 2 }, { text: '取消', value: 3 }];
  constructor(injector: Injector, private reimburseService: ReimburseService, private projectService: ProjectService
    , private router: Router, private employeeService: EmployeeServiceProxy) { super(injector); }

  ngOnInit() {
    this.getReimburse();
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

  getReimburse() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    if (this.projectId)
      params.ProjectId = this.projectId
    else
      params.ProjectId = this.search.projectId;
    params.Status = this.search.status;
    params.EmployeeId = this.search.employeeId;
    this.reimburseService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  //详情
  details(id: any) {
    this.router.navigate(['/app/pm/reimburse-detail', { id: id }]);
  }


  refresh() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getReimburse();
  }
}

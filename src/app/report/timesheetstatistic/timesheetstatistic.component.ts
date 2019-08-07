import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase, } from '@shared/app-component-base';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { TimesheetService, ProjectService, EmployeeServiceProxy } from 'services'

@Component({
  selector: 'app-timesheetstatistic',
  templateUrl: './timesheetstatistic.component.html',
  providers: [TimesheetService, ProjectService, EmployeeServiceProxy]
})
export class TimesheetstatisticComponent extends AppComponentBase implements OnInit {
  loading = "false";
  @Input() projectId;
  search: any = {};
  statuss = [{ text: '提交', value: 1 }, { text: '审批通过', value: 2 }, { text: '拒绝', value: 3 }, { text: '取消', value: 4 }];
  employees: any;
  projects: any;
  constructor(injector: Injector, private timesheetService: TimesheetService, private projectService: ProjectService
    , private employeeService: EmployeeServiceProxy) { super(injector); }

  ngOnInit() {
    this.getProjects();
    this.getEmployees();
    this.getTimeSheet();
  }

  //查询
  getTimeSheet() {
    this.loading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    if (this.projectId)
      params.ProjectId = this.projectId
    else
      params.ProjectId = this.search.projectId;
    params.EmployeeId = this.search.employeeId;
    params.Status = this.search.status;
    this.timesheetService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = "false"
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }


  //获取所属项目下拉列表
  getProjects() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projects = result;
    })
  }

  //获取所属员工下拉列表
  getEmployees() {
    this.employeeService.getDropDownDtos().subscribe((result) => {
      this.employees = result;
    })
  }

  refresh() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getTimeSheet();
  }
}

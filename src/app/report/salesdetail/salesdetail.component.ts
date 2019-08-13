import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ReportServices, ProjectService } from 'services'
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';

var nowDate = new Date();
@Component({
  selector: 'app-salesdetail',
  templateUrl: './salesdetail.component.html',
  styleUrls: ['./salesdetail.component.scss']
})
export class SalesdetailComponent extends AppComponentBase implements OnInit {
  projects = [];
  search: any = {};
  loading = false;

  constructor(injector: Injector, private reportServices: ReportServices, private projectService: ProjectService) { super(injector); }

  ngOnInit() {
    this.search.createDate = new Date(nowDate.getFullYear(), 0, 1);
    this.getProjectList();
    this.getSalesDetails();
  }

  //获取项目下拉列表
  getProjectList() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projects = result;
    });
  }

  getSalesDetails() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.ProjectId = this.search.projectId;
    params.CreateDate = this.search.createDate;
    this.reportServices.getSalesDetails(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  refresh() {
    this.search.ProjectId = '';
    this.search.createDate = new Date(nowDate.getFullYear(), 0, 1);
    this.query.pageIndex = 1;
    this.getSalesDetails();
  }
}

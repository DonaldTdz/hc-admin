import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ReportServices, ProjectService } from 'services'
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accountsreceivable-detail',
  templateUrl: './accountsreceivable-detail.component.html',
  styleUrls: ["./accountsreceivable-detail.component.scss"]
})
export class AccountsreceivableDetailComponent extends AppComponentBase implements OnInit {
  projects = [];
  search: any = {};
  loading = false;
  customerId: string;

  constructor(injector: Injector, private reportServices: ReportServices
    , private projectService: ProjectService, private actRouter: ActivatedRoute) {
    super(injector);
    this.customerId = this.actRouter.snapshot.queryParams['id'];
  }

  ngOnInit() {
    this.getProjectList();
    this.getCustomerReceivablesDetail();
  }

  //获取项目下拉列表
  getProjectList() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projects = result;
    });
  }

  //获取客户应收账款详情
  getCustomerReceivablesDetail() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.CustomerId = this.customerId;
    params.ProjectId = this.search.projectId;;
    this.reportServices.getCustomerReceivablesDetail(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  refresh() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getCustomerReceivablesDetail();
  }

  //返回
  return() {
    history.back();
  }

}

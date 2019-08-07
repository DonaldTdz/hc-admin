import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ReportServices, ProjectService } from 'services'
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';

var nowDate = new Date();
@Component({
  selector: 'app-profitstatistic',
  templateUrl: './profitstatistic.component.html',
  styleUrls: ['./profitstatistic.component.scss']
})
export class ProfitstatisticComponent extends AppComponentBase implements OnInit {
  projects = [];
  search: any = {};
  salesPieData: any = [];
  loading = false;
  profitStatistics: any = [];
  contractTotalAmount: string;

  constructor(injector: Injector, private reportServices: ReportServices
    , private projectService: ProjectService) {
    super(injector);
  }

  ngOnInit() {
    this.search.creationTime = new Date(nowDate.getFullYear(), 0, 1);
    this.getProjectList();
    this.getProfitStatistics();
  }

  //获取项目下拉列表
  getProjectList() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projects = result;
    });
  }

  //获取年利润合计
  getProfitStatistics() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.ProjectId = this.search.projectId;
    params.CreationTime = this.search.creationTime;
    this.reportServices.getProfitStatistics(params).subscribe((result: any[]) => {
      this.loading = false;
      this.profitStatistics = result;
      this.contractTotalAmount = `&yen ${result[result.length - 1].contractAmount.toFixed(2)}`;
      this.salesPieData = [{ x: '成本', y: result[result.length - 1].totalCostAmount }, { x: '应交增值税', y: result[result.length - 1].vatPayable }
        , { x: '城建税+教育附加', y: result[result.length - 1].cityEducationTax }, { x: '企业所得税', y: result[result.length - 1].corporateIncomeTax }
        , { x: '个人所得税', y: result[result.length - 1].individualIncomeTax }, { x: '利润', y: result[result.length - 1].profit }]
    })
  }

  refresh() {
    this.search.ProjectId = '';
    this.search.creationTime = new Date(nowDate.getFullYear(), 0, 1);
    this.query.pageIndex = 1;
    this.getProfitStatistics();
  }

  format(val: number) {
    return `&yen ${val.toFixed(2)}`;
  }

}

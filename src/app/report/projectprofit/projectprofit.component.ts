import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ReportServices } from 'services'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-projectprofit',
  templateUrl: './projectprofit.component.html',
  styles: []
})
export class ProjectprofitComponent extends AppComponentBase implements OnInit {

  projectProfits = [];
  search: any = {};
  loading = false;
  projectId = '';
  widthConfig = ['7%', '10%', '5%', '5%', '5%', '5%', '8%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%'];
  // scrollConfig = { x: '130%', y: '' };

  constructor(injector: Injector, private reportServices: ReportServices, private actRouter: ActivatedRoute) {
    super(injector);
    this.projectId = this.actRouter.snapshot.queryParams['projectId'];
  }

  ngOnInit() {
    this.getProjectProfitById();
  }

  getProjectProfitById() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.ProjectId = this.projectId;
    this.reportServices.getProjectProfitById(params).subscribe((result: any) => {
      this.loading = false;
      this.projectProfits = result;
    })
  }


  //返回
  return() {
    history.back();
  }
}

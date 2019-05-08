import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { TenderService, ProjectService } from 'services'
import { Tender } from 'entities'
import { Router } from '@angular/router';
import { CreateOrUpdateTenderComponent } from './create-or-update-tender/create-or-update-tender.component'

@Component({
  selector: 'app-tender',
  templateUrl: './tender.component.html',
  styles: []
})
export class TenderComponent extends AppComponentBase implements OnInit {
  projectList: any;
  loading = "false";
  @Input() projectId;
  search: any = {};
  constructor(injector: Injector, private tenderService: TenderService, private projectService: ProjectService, private router: Router) { super(injector); }

  ngOnInit() {
    this.getProjectList();
    this.getTenders();
  }

  //查询
  getTenders() {
    this.loading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    if (this.projectId)
      params.ProjectId = this.projectId
    else
      params.ProjectId = this.search.projectId;
    this.tenderService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = "false"
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  //编辑
  editDing(id: any) {
    this.modalHelper.open(CreateOrUpdateTenderComponent, { id: id, projectId: this.projectId }, 'lg', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getTenders();
      }
    });
  }

  详细
  details(id: any) {
    this.router.navigate(['/app/pm/tender-detail', { id: id }]);
  }

  //新增
  create() {
    this.modalHelper.open(CreateOrUpdateTenderComponent, { projectId: this.projectId }, 'lg', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getTenders();
      }
    });
  }

  //修改是否中标
  updateIsWinbid(tender: Tender) {
    this.tenderService.createOrUpdate(tender).finally(() => {
    }).subscribe(() => {
      this.notify.success(this.l('中标状态修改成功'));
    });
  }

  //获取项目下拉列表
  getProjectList() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projectList = result;
    });
  }

  //删除
  delete(entity: Tender) {
    this.message.confirm(
      "是否删除该项目?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.tenderService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getTenders();
          });
        }
      }
    )
  }

  refreshData() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getTenders();
  }

}

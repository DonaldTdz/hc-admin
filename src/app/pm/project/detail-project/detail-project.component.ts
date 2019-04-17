import { Component, OnInit, Injector } from '@angular/core';
import { Project, ProjectDetail } from 'entities';
import { AppComponentBase } from '@shared/app-component-base';
import { ProjectService, CustomerService, ProjectDetailService, EmployeeServiceProxy, DataDictionaryService } from 'services';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CreateOrUpdateProjectdetailComponent } from '../create-or-update-projectdetail/create-or-update-projectdetail.component';


@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.component.html',
  styleUrls: ['./detail-project.component.less'],
})
export class DetailProjectComponent extends AppComponentBase implements OnInit {
  project: Project = new Project();
  title: string;
  id: any = '';
  projectDetailLoading = 'false';
  projectDetailSearch: any = {};
  projectDetailType: any;
  projectStatus = ["线索", "立项", "进行中", "已完成", "已回款", "取消"];
  constructor(injector: Injector, private projectService: ProjectService, private actRouter: ActivatedRoute
    , private projectDetailService: ProjectDetailService
    , private dataDictionaryService: DataDictionaryService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.getById();
    this.getProjectDetails();
    this.getprojectDetailTypeList();
  }

  getById() {
    if (this.id) {
      this.projectService.getById(this.id).subscribe(res => {
        this.project = res;
        this.title = '项目编号：' + res.projectCode;
        // this.setFormValues(this.document);
        //alert(this.isAllUser)
      });
    }
  }

  //查询
  getProjectDetails() {
    this.projectDetailLoading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.Name = this.projectDetailSearch.name;
    params.Type = this.projectDetailSearch.type;
    this.projectDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.projectDetailLoading = "false"
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  //获取项目明细分类下拉列表
  getprojectDetailTypeList() {
    this.dataDictionaryService.getDropDownDtos("2").subscribe((result) => {
      this.projectDetailType = result;
    });
  }

  //删除项目明细
  deleteProjectDetail(entity: ProjectDetail) {
    this.message.confirm(
      "是否删除该项目明细:'" + entity.name + "'?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.projectDetailService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getProjectDetails();
          });
        }
      }
    )
  }

  //创建项目明细
  createProjectDetail() {
    this.modalHelper.open(CreateOrUpdateProjectdetailComponent, {}, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refreshProjectDetails();
      }
    });
  }

  //编辑项目明细
  editProjectDetail(id: any) {
    this.modalHelper.open(CreateOrUpdateProjectdetailComponent, { id: id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refreshProjectDetails();
      }
    });
  }

  refreshProjectDetails() {
    this.projectDetailSearch = {};
    this.query.pageIndex = 1;
    this.getProjectDetails();
  }

  //返回
  return() {
    history.back();
  }

}

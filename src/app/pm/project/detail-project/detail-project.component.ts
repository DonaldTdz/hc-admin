import { Component, OnInit, Injector } from '@angular/core';
import { Project, ProjectDetail, Tender, Purchase, Contract, Invoice } from 'entities';
import { NzTabChangeEvent } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ProjectService, ProjectDetailService, DataDictionaryService, TenderService, PurchaseService
  , ContractService, InvoiceService, ReimburseService, EmployeeServiceProxy
} from 'services';
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
  employees: any;
  timeSheet = "<app-timesheet [projectId]=\"id\"></app-timesheet>"
  reimburseSearch: any = {};
  projectDetailLoading = 'false';
  projectDetailSearch: any = {};
  projectDetailType: any;
  tableLoading = 'false';
  queryOne: any = {
    pageIndex: 1,
    pageSize: 10,
    skipCount: function () { return (this.pageIndex - 1) * this.pageSize; },
    total: 0,
  };
  projectStatus = ["线索", "立项", "进行中", "已完成", "已回款", "取消"];
  reimburseStatuss = [{ text: '提交', value: 1 }, { text: '审批通过', value: 2 }, { text: '取消', value: 3 }];
  constructor(injector: Injector, private projectService: ProjectService, private actRouter: ActivatedRoute
    , private projectDetailService: ProjectDetailService, private tenderService: TenderService, private purchaseService: PurchaseService
    , private dataDictionaryService: DataDictionaryService, private contractService: ContractService, private invoiceService: InvoiceService
    , private router: Router, private reimburseService: ReimburseService, private employeeService: EmployeeServiceProxy) {
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
    params.projectId = this.id;
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
      "是否删除该项目明细:'" + entity.name + "'?(请谨慎删除,如该项目明详细下面有其他功能正在使用,可能会出现无法正常使用的情况)",
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
    this.modalHelper.open(CreateOrUpdateProjectdetailComponent, { projectId: this.project.id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refreshProjectDetails();
      }
    });
  }

  //编辑项目明细
  editProjectDetail(id: any) {
    this.modalHelper.open(CreateOrUpdateProjectdetailComponent, { id: id, projectId: this.project.id }, 'md', {
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

  //当前激活 tab 面板变更回调函数
  change(args: NzTabChangeEvent) {
    switch (args.index) {
      case (0): //this.getTenderList();
        break;
      case (1): //this.getPurchaseList();
        break;
      case (2): //this.getContractList();
        break;
      // case (3): this.getInvoiceList();
      //   break;
      case (4): //this.getInvoiceList();
        break;
      case (5): //this.getReimburseList();
        break;
      case (6): //this.timeSheet = "<app-timesheet [projectId]=\"id\"></app-timesheet>";
        break;
      default: null;
    }

  }

  //返回
  return() {
    history.back();
  }

}

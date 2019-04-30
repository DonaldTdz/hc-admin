import { Component, OnInit, Injector } from '@angular/core';
import { Project, ProjectDetail, Tender, Purchase, Contract, Invoice } from 'entities';
import { NzTabChangeEvent } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { ProjectService, ProjectDetailService, DataDictionaryService, TenderService, PurchaseService, ContractService, InvoiceService } from 'services';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CreateOrUpdateProjectdetailComponent } from '../create-or-update-projectdetail/create-or-update-projectdetail.component';
import { CreateOrUpdateTenderComponent } from '../../tender/create-or-update-tender/create-or-update-tender.component'
import { CreateOrUpdatePurchaseComponent } from '../../purchase/create-or-update-purchase/create-or-update-purchase.component'
import { CreateOrUpdateContractComponent } from '../../contract/create-or-update-contract/create-or-update-contract.component'
import { CreateOrUpdateInvoiceComponent } from '../../invoice/create-or-update-invoice/create-or-update-invoice.component'

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
  tableLoading = 'false';
  queryOne: any = {
    pageIndex: 1,
    pageSize: 10,
    skipCount: function () { return (this.pageIndex - 1) * this.pageSize; },
    total: 0,
  };
  projectStatus = ["线索", "立项", "进行中", "已完成", "已回款", "取消"];
  constructor(injector: Injector, private projectService: ProjectService, private actRouter: ActivatedRoute
    , private projectDetailService: ProjectDetailService, private tenderService: TenderService, private purchaseService: PurchaseService
    , private dataDictionaryService: DataDictionaryService, private contractService: ContractService, private invoiceService: InvoiceService, private router: Router) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.getById();
    this.getProjectDetails();
    this.getprojectDetailTypeList();
    this.getTenderList();
  }

  getById() {
    if (this.id) {
      this.projectService.getById(this.id).subscribe(res => {
        this.project = res;
        this.title = '项目编号：' + res.projectCode;
      });
    }
  }

  //获取项目招标
  getTenderList() {
    this.tableLoading = "true"
    let params: any = {};
    params.SkipCount = this.queryOne.skipCount();
    params.MaxResultCount = this.queryOne.pageSize;
    params.ProjectId = this.id;
    this.tenderService.getAll(params).subscribe((result: PagedResultDto) => {
      this.tableLoading = "false";
      this.queryOne.dataList = result.items
      this.queryOne.total = result.totalCount;
    })
  }

  //项目招标详情
  tenderDetail(id: any) {
    this.router.navigate(['/app/pm/tender-detail', { id: id }]);
  }

  //新增招标
  createTender() {
    this.modalHelper.open(CreateOrUpdateTenderComponent, { projectId: this.id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getTenderList();
      }
    });
  }

  //编辑招标
  editTender(id: any) {
    this.modalHelper.open(CreateOrUpdateTenderComponent, { id: id, projectId: this.id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getTenderList();
      }
    });
  }


  //删除招标
  deleteTender(entity: Tender) {
    this.message.confirm(
      "是否删除该项目?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.tenderService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getTenderList();
          });
        }
      }
    )
  }

  //修改是否中标
  updateIsWinbid(tender: Tender) {
    this.tenderService.createOrUpdate(tender).finally(() => {
    }).subscribe(() => {
      this.notify.success(this.l('中标状态修改成功'));
    });
  }

  //获取项目发票
  getInvoiceList() {
    this.tableLoading = "true"
    let params: any = {};
    params.SkipCount = this.queryOne.skipCount();
    params.MaxResultCount = this.queryOne.pageSize;
    params.refId = this.id;
    this.invoiceService.getAll(params).subscribe((result: PagedResultDto) => {
      this.tableLoading = "false";
      this.queryOne.dataList = result.items
      this.queryOne.total = result.totalCount;
    })
  }

  //项目发票详情
  invoiceDetail(id: any) {
    this.router.navigate(['/app/pm/invoice-detail', { id: id }]);
  }

  //新增发票
  createInvoice() {
    this.modalHelper.open(CreateOrUpdateInvoiceComponent, { refId: this.id, type: 1 }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getInvoiceList();
      }
    });
  }

  //编辑发票
  editInvoice(id: any) {
    this.modalHelper.open(CreateOrUpdateInvoiceComponent, { id: id, refId: this.id, type: 1 }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getInvoiceList();
      }
    });
  }


  //删除发票
  deleteInvoice(entity: Invoice) {
    this.message.confirm(
      "是否删除该发票:'" + entity.title + "'?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.invoiceService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getInvoiceList();
          });
        }
      }
    )
  }


  //获取项目合同
  getContractList() {
    this.tableLoading = "true"
    let params: any = {};
    params.SkipCount = this.queryOne.skipCount();
    params.MaxResultCount = this.queryOne.pageSize;
    params.refId = this.id;
    this.contractService.getAll(params).subscribe((result: PagedResultDto) => {
      this.tableLoading = "false";
      this.queryOne.dataList = result.items
      this.queryOne.total = result.totalCount;
    })
  }

  //项目合同详情
  contractDetail(id: any) {
    this.router.navigate(['/app/pm/contract-detail', { id: id }]);
  }

  //新增合同
  createContract() {
    this.modalHelper.open(CreateOrUpdateContractComponent, { refId: this.id, type: 1 }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getContractList();
      }
    });
  }

  //编辑合同
  editContract(id: any) {
    this.modalHelper.open(CreateOrUpdateContractComponent, { id: id, refId: this.id, type: 1 }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getContractList();
      }
    });
  }


  //删除合同
  deleteContract(entity: Contract) {
    this.message.confirm(
      "是否删除该合同:'" + entity.contractCode + "'?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.contractService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getContractList();
          });
        }
      }
    )
  }

  //获取项目采购
  getPurchaseList() {
    this.tableLoading = "true"
    let params: any = {};
    params.SkipCount = this.queryOne.skipCount();
    params.MaxResultCount = this.queryOne.pageSize;
    params.ProjectId = this.id;
    this.purchaseService.getAll(params).subscribe((result: PagedResultDto) => {
      this.tableLoading = "false";
      this.queryOne.dataList = result.items
      this.queryOne.total = result.totalCount;
    })
  }

  //项目采购详情
  purchaseDetail(id: any) {
    this.router.navigate(['/app/pm/purchase-detail', { id: id }]);
  }

  //新增采购
  createPurchase() {
    this.modalHelper.open(CreateOrUpdatePurchaseComponent, { projectId: this.id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getPurchaseList();
      }
    });
  }

  //编辑采购
  editPurchase(id: any) {
    this.modalHelper.open(CreateOrUpdatePurchaseComponent, { id: id, projectId: this.id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getPurchaseList();
      }
    });
  }


  //删除采购
  deletePurchase(entity: Purchase) {
    this.message.confirm(
      "是否删除该采购:'" + entity.code + "'?(请谨慎删除,如该采购下面有其他功能正在使用,可能会出现无法正常使用的情况)",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.purchaseService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getPurchaseList();
          });
        }
      }
    )
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
      case (0): this.getTenderList();
        break;
      case (1): this.getPurchaseList();
        break;
      case (2): this.getContractList();
        break;
      // case (3): this.getInvoiceList();
      //   break;
      case (4): this.getInvoiceList();
        break;
      default: null;
    }

  }

  //返回
  return() {
    history.back();
  }

}

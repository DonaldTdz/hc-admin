import { Component, OnInit, Injector } from '@angular/core';
import { PurchaseService, PurchaseDetailService, SupplierService, ContractService, InvoiceService } from 'services';
import { AppComponentBase } from '@shared/app-component-base';
import { NzTabChangeEvent } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { Purchase, PurchaseDetail } from 'entities'
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CreateOrUpdatePurchasedetailComponent } from '../create-or-update-purchasedetail/create-or-update-purchasedetail.component'

@Component({
  selector: 'app-detail-purchase',
  templateUrl: './detail-purchase.component.html',
  providers: [PurchaseDetailService, SupplierService]
})
export class DetailPurchaseComponent extends AppComponentBase implements OnInit {
  id: any = '';
  search: any = {};
  supplierList: any;
  title: string;
  // queryOne: any = {
  //   pageIndex: 1,
  //   pageSize: 10,
  //   skipCount: function () { return (this.pageIndex - 1) * this.pageSize; },
  //   total: 0,
  // };
  purchaseDetailLoading = "false";
  tableLoading = "false";
  purchase: Purchase = new Purchase();
  constructor(injector: Injector, private purchaseService: PurchaseService, private actRouter: ActivatedRoute, private router: Router,
    private purchaseDetailService: PurchaseDetailService, private supplierService: SupplierService, private contractService: ContractService
    , private invoiceService: InvoiceService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.getProductById();
    this.getSupplierList();
    this.getPurchaseDetails();
    // this.getContractList();
  }

  getProductById() {
    if (this.id) {
      this.purchaseService.getById(this.id).subscribe(res => {
        this.purchase = res;
        this.title = '采购编号：' + res.code;
      });
    }
  }

  getSupplierList() {
    this.supplierService.getDropDownDtos().subscribe(res => {
      this.supplierList = res;
    })
  }

  //查询
  getPurchaseDetails() {
    this.purchaseDetailLoading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    // params.MaxResultCount = this.query.pageSize;
    // params.SupplierId = this.search.supplierId;
    params.PurchaseId = this.id;
    this.purchaseDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.purchaseDetailLoading = "false"
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  //编辑
  editDing(id: any) {
    console.log(id);
    this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, { id: id, purchaseId: this.id, projectId: this.purchase.projectId }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getPurchaseDetails();
      }
    });
  }

  //新增
  create() {
    this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, { purchaseId: this.id, projectId: this.purchase.projectId }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getPurchaseDetails();
      }
    });
  }


  //删除
  delete(entity: PurchaseDetail) {
    this.message.confirm(
      "是否删除该采购明细?(请谨慎删除,如该采购明细下面有其他功能正在使用,可能会出现无法正常使用的情况)",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.purchaseDetailService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getPurchaseDetails();
          });
        }
      }
    )
  }

  // //获取采购合同
  // getContractList() {
  //   this.tableLoading = "true"
  //   let params: any = {};
  //   params.SkipCount = this.queryOne.skipCount();
  //   params.MaxResultCount = this.queryOne.pageSize;
  //   params.refId = this.id;
  //   this.contractService.getAll(params).subscribe((result: PagedResultDto) => {
  //     this.tableLoading = "false";
  //     this.queryOne.dataList = result.items
  //     this.queryOne.total = result.totalCount;
  //   })
  // }

  // //采购合同详情
  // contractDetail(id: any) {
  //   this.router.navigate(['/app/pm/contract-detail', { id: id }]);
  // }

  // //获取采购发票
  // getInvoiceList() {
  //   this.tableLoading = "true"
  //   let params: any = {};
  //   params.SkipCount = this.queryOne.skipCount();
  //   params.MaxResultCount = this.queryOne.pageSize;
  //   params.refId = this.id;
  //   this.invoiceService.getAll(params).subscribe((result: PagedResultDto) => {
  //     this.tableLoading = "false";
  //     this.queryOne.dataList = result.items
  //     this.queryOne.total = result.totalCount;
  //   })
  // }

  // //采购发票详情
  // invoiceDetail(id: any) {
  //   this.router.navigate(['/app/pm/invoice-detail', { id: id }]);
  // }

  // refreshData() {
  //   this.search = {};
  //   this.query.pageIndex = 1;
  //   this.getPurchaseDetails();
  // }

  // //当前激活 tab 面板变更回调函数
  // change(args: NzTabChangeEvent) {
  //   switch (args.index) {
  //     case (0): this.getContractList();
  //       break;
  //     case (1): this.getInvoiceList();
  //       break;
  //     default: null;
  //   }

  // }

  //返回
  return() {
    history.back();
  }

}

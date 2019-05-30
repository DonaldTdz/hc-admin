import { Component, OnInit, Injector } from '@angular/core';
import { PurchaseDetailService, SupplierService } from 'services';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { NzTabChangeEvent } from 'ng-zorro-antd';

@Component({
  selector: 'app-detail-purchase',
  templateUrl: './detail-purchase.component.html',
  providers: [PurchaseDetailService, SupplierService]
})
export class DetailPurchaseComponent extends AppComponentBase implements OnInit {
  id: any = '';
  // search: any = {};
  // supplierList: any;
  // title: string;
  // queryOne: any = {
  //   pageIndex: 1,
  //   pageSize: 10,
  //   skipCount: function () { return (this.pageIndex - 1) * this.pageSize; },
  //   total: 0,
  // };
  tabIndex: number = 1;
  // purchaseDetailLoading = "false";
  // tableLoading = "false";
  // purchase: Purchase = new Purchase();
  constructor(injector: Injector, private actRouter: ActivatedRoute) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    // this.getProductById();
    // this.getSupplierList();
    // this.getPurchaseDetails();
    // this.getContractList();
  }

  // getProductById() {
  //   if (this.id) {
  //     this.purchaseService.getById(this.id).subscribe(res => {
  //       this.purchase = res;
  //       this.title = '采购编号：' + res.code;
  //     });
  //   }
  // }

  // getSupplierList() {
  //   this.supplierService.getDropDownDtos().subscribe(res => {
  //     this.supplierList = res;
  //   })
  // }

  // //查询
  // getPurchaseDetails() {
  //   this.purchaseDetailLoading = "true"
  //   let params: any = {};
  //   params.SkipCount = this.query.skipCount();
  //   // params.MaxResultCount = this.query.pageSize;
  //   // params.SupplierId = this.search.supplierId;
  //   params.PurchaseId = this.id;
  //   this.purchaseDetailService.getAll(params).subscribe((result: PagedResultDto) => {
  //     this.purchaseDetailLoading = "false"
  //     this.query.dataList = result.items;
  //     this.query.total = result.totalCount;
  //   })
  // }

  // //编辑
  // editDing(id: any) {
  //   console.log(id);
  //   this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, { id: id, purchaseId: this.id, projectId: this.purchase.projectId }, 'md', {
  //     nzMask: true
  //   }).subscribe(isSave => {
  //     if (isSave) {
  //       this.getPurchaseDetails();
  //     }
  //   });
  // }

  // //新增
  // create() {
  //   this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, { purchaseId: this.id, projectId: this.purchase.projectId }, 'md', {
  //     nzMask: true
  //   }).subscribe(isSave => {
  //     if (isSave) {
  //       this.getPurchaseDetails();
  //     }
  //   });
  // }


  // //删除
  // delete(entity: PurchaseDetail) {
  //   this.message.confirm(
  //     "是否删除该采购明细?(请谨慎删除,如该采购明细下面有其他功能正在使用,可能会出现无法正常使用的情况)",
  //     "信息确认",
  //     (result: boolean) => {
  //       if (result) {
  //         this.purchaseDetailService.delete(entity.id).subscribe(() => {
  //           this.notify.success('删除成功！');
  //           this.getPurchaseDetails();
  //         });
  //       }
  //     }
  //   )
  // }

  //当前激活 tab 面板变更回调函数
  change(args: NzTabChangeEvent) {
    this.tabIndex = args.index;
  }

  //返回
  return() {
    history.back();
  }

}

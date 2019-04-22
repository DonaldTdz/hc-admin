import { Component, OnInit, Injector } from '@angular/core';
import { PurchaseService, PurchaseDetailService, SupplierService } from 'services';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
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
  tableLoading = "false";
  purchase: Purchase = new Purchase();
  constructor(injector: Injector, private purchaseService: PurchaseService, private actRouter: ActivatedRoute, private purchaseDetailService: PurchaseDetailService
    , private supplierService: SupplierService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.getProductById();
    this.getSupplierList();
    this.getPurchaseDetails();
  }

  getProductById() {
    if (this.id) {
      this.purchaseService.getById(this.id).subscribe(res => {
        this.purchase = res;
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
    this.tableLoading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.SupplierId = this.search.supplierId;
    params.PurchaseId = this.id;
    this.purchaseDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.tableLoading = "false"
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
        this.refreshData();
      }
    });
  }

  //新增
  create() {
    this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, { purchaseId: this.id, projectId: this.purchase.projectId }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refreshData();
      }
    });
  }


  //删除
  delete(entity: PurchaseDetail) {
    this.message.confirm(
      "是否删除该采购明细?",
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

  refreshData() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getPurchaseDetails();
  }

  //返回
  return() {
    history.back();
  }

}

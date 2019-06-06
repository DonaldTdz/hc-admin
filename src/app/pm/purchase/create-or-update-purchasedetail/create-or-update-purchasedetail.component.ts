import { Component, OnInit, Injector, Input } from '@angular/core';
import { PurchaseDetail } from 'entities'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectDetailService, SupplierService, PurchaseDetailService } from 'services'
import { ModalComponentBase } from '@shared/component-base';
import { parse } from 'url';

@Component({
  selector: 'app-create-or-update-purchasedetail',
  templateUrl: './create-or-update-purchasedetail.component.html',
  providers: [PurchaseDetailService, SupplierService]
})
export class CreateOrUpdatePurchasedetailComponent extends ModalComponentBase implements OnInit {
  form: FormGroup;
  @Input() id: any;
  @Input() purchaseId: any;
  @Input() projectId: any;
  @Input() purchaseDetail: PurchaseDetail = new PurchaseDetail();
  isInput = "true";
  supplierId: string;
  supplierList: any;
  projectDetailList: any;
  constructor(injector: Injector, private projectDetailService: ProjectDetailService, private supplierService: SupplierService
    , private fb: FormBuilder, private purchaseDetailService: PurchaseDetailService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      supplierId: [null, Validators.compose([Validators.required])],
      num: [null, Validators.compose([Validators.required])],
      projectDetailId: [null, Validators.compose([Validators.required])],
      price: [null]
    });
    this.getSupplierList();
    this.getProjectDetailList();
    if (this.id || this.purchaseDetail.supplierId) {
      if (this.id)
        this.getData();
      this.title = "编辑采购明细";
      this.supplierId = this.purchaseDetail.supplierId.toString();
    } else {
      this.purchaseDetail.purchaseId = this.purchaseId;
      this.title = "新增采购明细";
    }
  }

  getSupplierList() {
    this.supplierService.getDropDownDtos().subscribe((result) => {
      this.supplierList = result;
    })
  }

  //获取采购数量
  getPurchaseNum() {
    if (this.purchaseDetail.projectDetailId) {
      this.projectDetailService.GetById(this.purchaseDetail.projectDetailId).subscribe((resule) => {
        this.purchaseDetail.num = resule.num;
      });
    }
  }

  getProjectDetailList() {
    this.projectDetailService.GetDropDownsByProjectId(this.projectId).subscribe((result) => {
      this.projectDetailList = result;
    });
  }

  getData() {
    this.purchaseDetailService.getById(this.id).subscribe((result) => {
      this.purchaseDetail = result;
      this.supplierId = this.purchaseDetail.supplierId.toString();
    });
  }

  save() {
    this.purchaseDetail.supplierId = parseInt(this.supplierId);
    if (!this.id && !this.purchaseId) {
      for (let supplier of this.supplierList) {
        if (supplier.value == this.purchaseDetail.supplierId)
          this.purchaseDetail.supplierName = supplier.text;
      }
      for (let projectDetail of this.projectDetailList) {
        if (projectDetail.value == this.purchaseDetail.projectDetailId)
          this.purchaseDetail.projectDetailName = projectDetail.text;
      }
      // this.purchaseDetail.projectDetailName
      this.notify.success('保存成功！');
      this.success(this.purchaseDetail);
    }
    else {
      this.purchaseDetailService.createOrUpdate(this.purchaseDetail).finally(() => {
        this.saving = false;
      }).subscribe(() => {
        this.notify.success('保存成功！');
        this.success();
      });
    }
  }

}

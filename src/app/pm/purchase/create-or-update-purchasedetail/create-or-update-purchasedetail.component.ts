import { Component, OnInit, Injector, Input } from '@angular/core';
import { PurchaseDetail } from 'entities'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectDetailService, SupplierService, PurchaseDetailService } from 'services'
import { ModalComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-create-or-update-purchasedetail',
  templateUrl: './create-or-update-purchasedetail.component.html',
  providers: [PurchaseDetailService, SupplierService]
})
export class CreateOrUpdatePurchasedetailComponent extends ModalComponentBase implements OnInit {
  purchaseDetail: PurchaseDetail = new PurchaseDetail();
  form: FormGroup;
  @Input() id: any;
  @Input() purchaseId: any;
  @Input() projectId: any;
  isInput = "true";
  supplierList: any;
  ProjectDetailList: any;
  constructor(injector: Injector, private projectDetailService: ProjectDetailService, private supplierService: SupplierService
    , private fb: FormBuilder, private purchaseDetailService: PurchaseDetailService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      supplierId: [null, Validators.compose([Validators.required])],
      projectDetailId: [null],
      price: [null]
    });
    this.getProjectDetailList();
    this.getSupplierList();
    if (this.id) {
      this.getData();
      this.title = "编辑采购明细";
    } else {
      this.title = "新增采购明细";
    }
  }

  getSupplierList() {
    this.supplierService.getDropDownDtos().subscribe((result) => {
      this.supplierList = result;
    })
  }

  getProjectDetailList() {
    this.projectDetailService.GetDropDownsByProjectId(this.projectId).subscribe((result) => {
      this.ProjectDetailList = result;
    });
  }

  getData() {
    this.purchaseDetailService.getById(this.id).subscribe((result) => {
      this.purchaseDetail = result;
    });
  }

  save() {
    this.purchaseDetail.purchaseId = this.purchaseId;
    this.purchaseDetailService.createOrUpdate(this.purchaseDetail).finally(() => {
      this.saving = false;
    }).subscribe((result: any) => {
      if (result.code == 0) {
        this.notify.error(result.msg);
      } else {
        this.notify.success(result.msg);
        this.success();
      }
    });
  }

}

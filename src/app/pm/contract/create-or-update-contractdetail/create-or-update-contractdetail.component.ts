import { Component, OnInit, Injector, Input } from '@angular/core';
import { ContractDetail } from 'entities'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectDetailService, ContractDetailService, PurchaseDetailService } from 'services'
import { ModalComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-create-or-update-contractdetail',
  templateUrl: './create-or-update-contractdetail.component.html',
  providers: [PurchaseDetailService]
})
export class CreateOrUpdateContractdetailComponent extends ModalComponentBase implements OnInit {

  form: FormGroup;
  @Input() id: any;
  @Input() refId: any;
  @Input() contractId: any;
  @Input() contractType: any;
  @Input() contractDetail: ContractDetail = new ContractDetail();
  refDetailList: any;
  constructor(injector: Injector, private projectDetailService: ProjectDetailService, private contractDetailService: ContractDetailService
    , private fb: FormBuilder, private purchaseDetailService: PurchaseDetailService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      refDetailId: [null, Validators.compose([Validators.required])],
      deliveryDate: [null]
    });
    if (this.contractType == 1) {
      this.getProjectDetailList();
    } else {
      this.getpurchaseDetailList();
    }
    if (this.id || this.contractDetail.refDetailId) {
      if (this.id)
        this.getData();
      this.title = "编辑合同明细";
    } else {
      this.title = "新增合同明细";
    }
  }

  getProjectDetailList() {
    this.projectDetailService.GetDropDownsByProjectId(this.refId).subscribe((result) => {
      this.refDetailList = result;
    })
  }

  getpurchaseDetailList() {
    this.purchaseDetailService.GetDropDownsByPurchaseId(this.refId).subscribe((result) => {
      this.refDetailList = result;
    });
  }

  getData() {
    this.contractDetailService.getById(this.id).subscribe((result) => {
      this.contractDetail = result;
    });
  }

  save() {
    // if (!this.contractId && !this.id) {
    //   this.notify.success('保存成功！');
    //   this.success(this.contractDetail);
    // } else {
    this.contractDetail.contractId = this.contractId;
    this.contractDetailService.createOrUpdate(this.contractDetail).finally(() => {
      this.saving = false;
    }).subscribe(() => {
      this.notify.success('保存成功！');
      this.success();
    });
    // }
  }

}

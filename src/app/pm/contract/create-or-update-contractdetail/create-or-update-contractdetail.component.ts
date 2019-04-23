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
  contractDetail: ContractDetail = new ContractDetail();
  form: FormGroup;
  @Input() id: any;
  @Input() refId: any;
  @Input() contractId: any;
  @Input() contractType: any;
  refDetailList: any;
  constructor(injector: Injector, private projectDetailService: ProjectDetailService, private contractDetailService: ContractDetailService
    , private fb: FormBuilder, private purchaseDetailService: PurchaseDetailService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      refDetailId: [null, Validators.compose([Validators.required])],
      deliveryDate: [null]
    });
    if (this.id) {
      this.getData();
      this.title = "编辑合同明细";
    } else {
      this.title = "新增合同明细";
    }
    if (this.contractType == 1) {
      this.getProjectDetailList();
    } else {
      this.getpurchaseDetailList();
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
    this.contractDetail.contractId = this.contractId;
    this.contractDetailService.createOrUpdate(this.contractDetail).finally(() => {
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

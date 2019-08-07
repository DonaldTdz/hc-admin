import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AdvancePaymentDetailService, PurchaseDetailService } from 'services'
import { ModalComponentBase, PagedResultDto } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';
import { advanceActivatedRoute } from '@angular/router/src/router_state';

@Component({
  selector: 'app-advancepayment-detail',
  templateUrl: './advancepayment-detail.component.html',
  providers: [AdvancePaymentDetailService]
})
export class AdvancepaymentDetailComponent extends ModalComponentBase implements OnInit {
  form: FormGroup;
  @Input() advancePaymentId: string;
  @Input() purchaseId: string;
  purchaseDetails = [];
  editIndex = -1;
  loading: boolean = false;
  advancePaymentAmount: number = 0;
  editObj: any;
  title: string;
  constructor(injector: Injector, private advancePaymentDetailService: AdvancePaymentDetailService
    , private fb: FormBuilder, private purchaseDetailService: PurchaseDetailService
  ) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      advancePaymentDetails: this.fb.array([]),
    });
    this.title = "编辑预付款明细";
    this.getPurchaseDetailSelect();
    this.getAdvancePaymentDetails();
  }

  //获取采购明细下拉列表
  getPurchaseDetailSelect() {
    this.purchaseDetailService.getDropDownsByPurchaseId(this.purchaseId).subscribe((result: any) => {
      this.purchaseDetails = result;
    })
  }

  //获取预付款明细
  getAdvancePaymentDetails() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = 0;
    params.MaxResultCount = 10;
    params.AdvancePaymentId = this.advancePaymentId;
    this.advancePaymentDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      while (this.advancePaymentDetails.length !== 0) {
        this.advancePaymentDetails.removeAt(0)
      }
      for (let item of result.items) {
        const field = this.advancePaymentDetail();
        field.patchValue(item);
        this.advancePaymentDetails.push(field);
        this.advancePaymentAmount += item.amount;
      }
    });
  }

  advancePaymentDetail(): FormGroup {
    return this.fb.group({
      id: [null],
      advancePaymentId: [null],
      purchaseDetailId: [null, Validators.required],
      ratio: [null, Validators.required],
      amount: [null, Validators.required],
      creationTime: [null],
      purchaseDetailName: [null],
    });
  }

  get advancePaymentDetails() {
    return this.form.controls.advancePaymentDetails as FormArray;
  }

  //新增
  add() {
    this.advancePaymentDetails.push(this.advancePaymentDetail());
    this.edit(this.advancePaymentDetails.length - 1);
  }

  //修改
  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.advancePaymentDetails.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.advancePaymentDetails.at(index).value };
    this.editIndex = index;
    this.advancePaymentAmount -= this.advancePaymentDetails.value[index].amount;
  }

  //保存
  save(index: number) {
    this.advancePaymentDetails.value[index].advancePaymentId = this.advancePaymentId;
    this.advancePaymentDetails.at(index).markAsDirty();
    if (this.advancePaymentDetails.at(index).invalid) return;
    this.editIndex = -1;
    if (this.advancePaymentDetails.value[index].id)
      this.advancePaymentDetails.value[index].creationTime = this.editObj.creationTime;
    else
      delete (this.advancePaymentDetails.value[index].creationTime);

    this.advancePaymentAmount += this.advancePaymentDetails.value[index].amount;
    this.advancePaymentDetailService.createOrUpdate(this.advancePaymentDetails.value[index])
      .subscribe((result: any) => {
        this.notify.success("保存成功");
        this.getAdvancePaymentDetails();
      });
  }

  //删除
  del(index: number, id: any) {
    this.advancePaymentAmount -= this.advancePaymentDetails.value[index].amount;
    this.advancePaymentDetails.removeAt(index);
    if (id) {
      this.advancePaymentDetailService.delete(id).subscribe(() => {
        this.notify.success('删除成功！');
      });
    }
  }

  //提交
  onSubmit() {
    this.notify.success("保存成功");
    this.success(this.advancePaymentAmount);
  }

}

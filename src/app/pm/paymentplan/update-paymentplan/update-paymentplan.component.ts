import { Component, OnInit, Input, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentPlanService } from 'services'
import { ModalComponentBase } from '@shared/component-base';
import { PaymentPlan } from 'entities'

@Component({
  selector: 'app-update-paymentplan',
  templateUrl: './update-paymentplan.component.html',
  providers: [PaymentPlanService]
})
export class UpdatePaymentplanComponent extends ModalComponentBase implements OnInit {
  statuss = [{ text: '未回款', value: 0 }, { text: '已回款', value: 1 }]
  form: FormGroup;
  @Input() id: number;
  // @Input() projectId;
  paymentPlan: PaymentPlan = new PaymentPlan();
  constructor(injector: Injector, private paymentPlanService: PaymentPlanService, private fb: FormBuilder) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      planTime: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.maxLength(18), Validators.required])],
      status: [null],
      paymentTime: [null],
      desc: [null, Validators.compose([Validators.maxLength(250)])]
    });
    this.getData();
  }

  //编辑获取数据
  getData() {
    this.paymentPlanService.getById(this.id.toString()).subscribe((result) => {
      this.paymentPlan = result;
      // this.jointAttachments();
      // this.getRefList();
    });
  }

  //保存
  save() {
    // this.paymentPlan.projectId = this.projectId;
    this.paymentPlanService.createOrUpdate(this.paymentPlan).finally(() => {
      this.saving = false;
    }).subscribe(() => {
      this.notify.success('保存成功！');
      this.success();
    });
  }

}

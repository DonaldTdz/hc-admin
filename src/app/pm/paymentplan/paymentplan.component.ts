import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase, } from '@shared/app-component-base';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { PaymentPlanService } from 'services'
import { PaymentPlan } from 'entities'
import { CreatePaymentplanComponent } from './create-paymentplan/create-paymentplan.component'
import { UpdatePaymentplanComponent } from './update-paymentplan/update-paymentplan.component'

@Component({
  selector: 'app-paymentplan',
  templateUrl: './paymentplan.component.html',
  providers: [PaymentPlanService]
})
export class PaymentplanComponent extends AppComponentBase implements OnInit {
  loading = "false";
  @Input() projectId;
  // contractType = [{ text: '未回款', value: 1 }, { text: '已回款', value: 2 }]
  constructor(injector: Injector, private paymentPlanService: PaymentPlanService) { super(injector); }

  ngOnInit() {
    this.getPaymentPlan();
  }

  //查询
  getPaymentPlan() {
    this.loading = "true"
    let params: any = {};
    params.ProjectId = this.projectId;
    this.paymentPlanService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = "false"
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  //修改是否中标
  updateIsWinbid(paymentPlan: PaymentPlan) {
    this.paymentPlanService.createOrUpdate(paymentPlan).finally(() => {
    }).subscribe(() => {
      this.notify.success(this.l('回款状态修改成功'));
    });
  }

  //编辑
  editDing(id: any) {
    console.log(id);
    this.modalHelper.open(UpdatePaymentplanComponent, { id: id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getPaymentPlan();
      }
    });
  }

  //新增
  create() {
    this.modalHelper.open(CreatePaymentplanComponent, { projectId: this.projectId }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getPaymentPlan();
      }
    });
  }


  //删除
  delete(entity: PaymentPlan) {
    this.message.confirm(
      "是否删除该回款计划?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.paymentPlanService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getPaymentPlan();
          });
        }
      }
    )
  }

}

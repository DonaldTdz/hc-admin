import { Component, OnInit, Injector } from '@angular/core';
import { CustomerService } from 'services';
import { Customer } from 'entities';
import { ModalComponentBase } from '@shared/component-base';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { _Validators } from '@delon/util';

@Component({
  moduleId: module.id,
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styles: [],
})
export class CreateCustomerComponent extends ModalComponentBase implements OnInit {
  customer: Customer = new Customer();
  customerTypes = [
    { value: 1, text: '企业' },
    { value: 2, text: '个人' },
    { value: 3, text: '其他' },
  ];

  form: FormGroup;
  constructor(
    injector: Injector,
    private service: CustomerService,
    private fb: FormBuilder,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.customer.type = 1;
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])], //客户名称
      type: [null], //客户类型
      address: [null], //地址
      zipCode: [
        null,
        Validators.compose([Validators.pattern('^[a-zA-Z0-9 ]{3,12}$')]),
      ], //邮编
      tel: [
        null,
        Validators.compose([Validators.pattern('(\\+\\d+)?1[34578]\\d{9}$')]),
      ], //电话
      contact: [null, Validators.compose([])],
      position: [null, Validators.compose([])],
      phone: [
        null,
        Validators.compose([Validators.pattern('(\\+\\d+)?1[34578]\\d{9}$')]),
      ], //联系人电话
      desc: [null, Validators.compose([Validators.maxLength(500)])], //描述
      remark: [null, Validators.compose([Validators.maxLength(500)])], //备注
    });
  }

  //保存
  save() {
    this.service
      .createOrUpdate(this.customer)
      .finally(() => {
        this.saving = false;
      })
      .subscribe((result: any) => {
        if (result.code == 0) {
          this.notify.error(result.msg);
        } else {
          this.notify.success(result.msg);
          this.success();
        }
      });
  }
}

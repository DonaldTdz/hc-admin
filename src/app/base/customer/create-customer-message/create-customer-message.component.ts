import { Component, OnInit, Inject, Injector } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors, NgControl } from '@angular/forms';
import { Customer } from 'entities/customer';
import { CustomerService } from 'services';

@Component({
  moduleId: module.id,
  selector: 'app-create-customer-message',
  templateUrl: './create-customer-message.component.html',
  styles: []
})
export class CreateCustomerMessageComponent extends ModalComponentBase implements OnInit {
  customer: Customer = new Customer();
  customerTypes = [
    { value: 1, text: '企业' },
    { value: 2, text: '个人' },
    { value: 3, text: '其他' },
  ];

  constructor(injector: Injector, private service: CustomerService) {
    super(injector);
  }

  //初始化
  ngOnInit(): void {

  }

  //保存
  save() {
    this.customer.isDeleted = false;//【是否删除】新建时默认不删除
    //this.customer.creationTime = Date.parse(new Date().toDateString());  //创建时间默认为当前时间
    console.log(this.customer.name);
    this.service.update(this.customer).finally(() => {
      this.saving = false;
    }).subscribe(() => {
      this.notify.success(this.l('SavedSuccessfully'));
      this.success();
    });
  }
}

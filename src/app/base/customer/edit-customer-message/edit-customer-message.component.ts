import { Component, OnInit, Inject, Injector, Input } from '@angular/core';
import { Customer } from 'entities';
import { CustomerService } from 'services';
import { ModalComponentBase } from '@shared/component-base';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors, NgControl } from '@angular/forms';

@Component({
  selector: 'app-edit-customer-message',
  templateUrl: './edit-customer-message.component.html',
  styles: []
})



export class EditCustomerMessageComponent extends ModalComponentBase implements OnInit {
  @Input() id: number;
  param: any = { triType: 0, msType: 0 };

  customer: Customer = new Customer();
  customerTypes = [
    { value: 1, text: '企业' },
    { value: 2, text: '个人' },
    { value: 3, text: '其他' },
  ];
  constructor(
    injector: Injector,
    private service: CustomerService) {
    super(injector);
  }


  ngOnInit() {
    this.fetchData();
  }

  //获取单条关注消息
  fetchData(): void {
    this.service.getById(this.id.toString()).subscribe((result) => {
      this.customer = result;
      console.log(result);
    });
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

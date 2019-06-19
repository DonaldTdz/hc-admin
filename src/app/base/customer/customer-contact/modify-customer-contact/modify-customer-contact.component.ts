import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { CustomerContactService } from 'services';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CustomerContact } from 'entities';

@Component({
  selector: 'app-modify-customer-contact',
  templateUrl: './modify-customer-contact.component.html',
  styles: []
})
export class ModifyCustomerContactComponent extends ModalComponentBase implements OnInit {
  @Input() id: number;
  @Input() customerId: number;
  form: FormGroup;
  title: string = '';
  customerContact: CustomerContact = new CustomerContact()
  constructor(injector: Injector, private customerContactService: CustomerContactService, private fb: FormBuilder) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      deptName: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      position: [null, Validators.compose([Validators.maxLength(250)])], //地址
      phone: [null, Validators.compose([Validators.pattern('(\\+\\d+)?1[345789]\\d{9}$')]),], //邮编
    });
    if (this.id) {
      this.getData();
      this.title = "编辑联系人";
    } else {
      this.title = "新增联系人";
    }
  }

  getData() {
    this.customerContactService.getById(this.id.toString()).subscribe((result) => {
      this.customerContact = result;
    });
  }

  save() {
    this.customerContact.customerId = this.customerId;
    this.customerContactService.createOrUpdate(this.customerContact).finally(() => {
      this.saving = false;
    }).subscribe((result: any) => {
      this.notify.success("保存成功");
      this.success();
    });
  }

}

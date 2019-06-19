import { Component, OnInit, Inject, Injector, Input } from '@angular/core';
import { Customer } from 'entities';
import { CustomerService } from 'services';
import { ModalComponentBase } from '@shared/component-base';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors, NgControl } from '@angular/forms';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styles: []
})



export class EditCustomerComponent extends ModalComponentBase implements OnInit {
  @Input() id: number;
  param: any = { triType: 0, msType: 0 };

  customer: Customer = new Customer();
  customerTypes = [
    { value: 1, text: '企业' },
    { value: 2, text: '个人' },
    { value: 3, text: '其他' },
  ];
  form: FormGroup;
  constructor(
    injector: Injector,
    private service: CustomerService, private fb: FormBuilder) {
    super(injector);
  }


  ngOnInit() {
    this.fetchData();

    this.customer.type = 1;
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])],  //客户名称
      deptName: [null, Validators.compose([Validators.required])],  //客户部门名称
      type: [null],  //客户类型
      address: [null],  //地址
      zipCode: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9 ]{3,12}$')])],  //邮编
      tel: [null, Validators.compose([Validators.pattern('(\\+\\d+)?1[34578]\\d{9}$')])],  //电话
      contact: [null],  //联系人
      position: [null],  //联系人职位      
      phone: [null, Validators.compose([Validators.pattern('(\\+\\d+)?1[34578]\\d{9}$')])],  //联系人电话
      desc: [null, Validators.compose([Validators.maxLength(500)])],  //描述
      remark: [null, Validators.compose([Validators.maxLength(500)])],  //备注
    });
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
    this.service.createOrUpdate(this.customer).finally(() => {
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

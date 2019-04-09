import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponentBase } from '@shared/component-base';
import { Account } from "entities";
import { CompanyAccountService } from 'services';

@Component({
  selector: 'app-create-company-account',
  templateUrl: './create-company-account.component.html',
  styles: []
})
export class CreateCompanyAccountComponent extends ModalComponentBase implements OnInit {
  @Input() companyId: number;
  @Input() initial: number;
  form: FormGroup;
  constructor(injector: Injector, private companyAccountService: CompanyAccountService, private fb: FormBuilder) { super(injector); }
  account: Account = new Account();
  AccoutType = [
    { value: 1, text: '入账' },
    { value: 2, text: '出账' },
  ]
  ngOnInit() {
    this.account.amount = 0;
    this.account.initial = this.initial;
    this.account.companyId = this.companyId;
    this.form = this.fb.group({
      type: [null, Validators.compose([Validators.required])],
      initial: [null, Validators.compose([Validators.required, Validators.maxLength(18)])],
      amount: [null, Validators.compose([Validators.maxLength(18)])],
      ending: [null, Validators.compose([Validators.required, Validators.maxLength(18)])],
      desc: [null, Validators.compose([Validators.maxLength(250)])],
    });
    this.countEnding();
  }

  countEnding() {
    if (this.account.type == 2)
      this.account.ending = this.account.initial - this.account.amount;
    else
      this.account.ending = this.account.initial + this.account.amount;
  }
  save() {
    this.companyAccountService.createOrUpdate(this.account).finally(() => {
      this.saving = false;
    }).subscribe(() => {
      this.notify.success('保存成功！');
      this.success();
    });
  }
}

import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReimburseDetail } from 'entities'
import { DataDictionaryService } from 'services'

@Component({
  selector: 'app-modify-reimbursedetail',
  templateUrl: './modify-reimbursedetail.component.html',
  styles: []
})
export class ModifyReimburseDetailComponent extends ModalComponentBase implements OnInit {
  @Input() reimburseDetailOld: any;
  form: FormGroup;
  typeList = [];
  reimburseDetail = {};
  constructor(injector: Injector, private fb: FormBuilder, private dataDictionaryService: DataDictionaryService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      happenDate: [null, Validators.required],
      type: [null, Validators.compose([Validators.maxLength(25), Validators.required])],
      place: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      customer: [null, Validators.maxLength(100)],
      amount: [null, Validators.compose([Validators.required, Validators.maxLength(18)])],
      invoiceNum: [null, Validators.compose([Validators.maxLength(18)])],
      remark: [null, Validators.maxLength(250)],
      desc: [null, Validators.maxLength(250)],
      attachments: [null]
    });
    if (this.reimburseDetailOld) {
      this.reimburseDetail = this.reimburseDetailOld;
    }
    this.getTypeList();
  }

  //获取费用类型
  getTypeList() {
    this.dataDictionaryService.getDropDownDtos("3").subscribe((result) => {
      this.typeList = result;
    });
  }

  save() {
    this.notify.success("保存成功");
    this.success(this.reimburseDetail);
  }

}

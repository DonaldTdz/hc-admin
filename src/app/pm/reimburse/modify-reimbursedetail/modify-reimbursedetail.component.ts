import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReimburseDetail } from 'entities'
import { DataDictionaryService, ReimburseDetailService } from 'services'
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-modify-reimbursedetail',
  templateUrl: './modify-reimbursedetail.component.html',
  providers: [ReimburseDetailService]
})
export class ModifyReimburseDetailComponent extends ModalComponentBase implements OnInit {
  @Input() reimburseDetailId: string;
  @Input() reimburseId: string;
  form: FormGroup;
  reimburseDetail: ReimburseDetail = new ReimburseDetail();
  typeList = [];
  constructor(injector: Injector, private fb: FormBuilder, private dataDictionaryService: DataDictionaryService
    , private reimburseDetailService: ReimburseDetailService, private nzMsg: NzMessageService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      happenDate: [null, Validators.required],
      type: [null, Validators.compose([Validators.maxLength(25), Validators.required])],
      place: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      customer: [null, Validators.maxLength(100)],
      amount: [null, Validators.compose([Validators.required, Validators.maxLength(18)])],
      invoiceNum: [null, Validators.compose([Validators.maxLength(18)])],
      desc: [null, Validators.maxLength(250)],
      attachments: [null]
    });
    this.getTypeList();
    if (this.reimburseDetailId)
      this.getData();
    else
      this.reimburseDetail.reimburseId = this.reimburseId;
  }

  //获取费用类型
  getTypeList() {
    this.dataDictionaryService.getDropDownDtos("3").subscribe((result) => {
      this.typeList = result;
    });
  }

  //编辑获取数据
  getData() {
    this.reimburseDetailService.getById(this.reimburseDetailId).subscribe((result) => {
      this.reimburseDetail = result;
    });
  }

  save() {
    if (!this.reimburseDetail.reimburseId) {
      return this.nzMsg.warning("保存失败,请重新创建报销!!");
    } else {
      this.reimburseDetailService.createOrUpdate(this.reimburseDetail).finally(() => {
      }).subscribe((totalAmount: number) => {
        this.nzMsg.success("保存成功");
        this.success(totalAmount);
      });
    }
  }

}

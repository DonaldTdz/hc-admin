import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Purchase } from 'entities'
import { PurchaseService, ProjectService, EmployeeServiceProxy } from 'services'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-or-update-purchase',
  templateUrl: './create-or-update-purchase.component.html',
  styles: []
})
export class CreateOrUpdatePurchaseComponent extends ModalComponentBase implements OnInit {
  @Input() id: number;
  title: string;
  form: FormGroup;
  projectList: any;
  employeeList: any;
  purchase: Purchase = new Purchase();
  constructor(injector: Injector, private purchaseService: PurchaseService, private datePipe: DatePipe, private fb: FormBuilder, private projectService: ProjectService
    , private employeeServiceProxy: EmployeeServiceProxy) { super(injector); }

  ngOnInit() {
    this.purchase.code = "HC-C-YJ" + this.datePipe.transform(new Date(), 'yyyyMMdd') + '001'
    this.form = this.fb.group({
      code: [null, Validators.compose([Validators.required, Validators.maxLength(35)])],
      projectId: [null, Validators.compose([Validators.required])],
      employeeId: [null],
      purchaseDate: [null],
      desc: [null, Validators.compose([Validators.maxLength(250)])],
    });
    this.getProjectList();
    this.getEmployeeList();
    if (this.id) {
      this.getData();
      this.title = "编辑采购";
    } else {
      this.title = "新增采购";
    }
  }

  //编辑获取数据
  getData() {
    this.purchaseService.getById(this.id.toString()).subscribe((result) => {
      this.purchase = result;
    });
  }

  //获取项目下拉列表
  getProjectList() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projectList = result;
    });
  }

  //获取人员下拉列表
  getEmployeeList() {
    this.employeeServiceProxy.getDropDownDtos().subscribe((result) => {
      this.employeeList = result;
    });
  }

  save() {
    this.purchaseService.createOrUpdate(this.purchase).finally(() => {
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

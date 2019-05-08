import { Component, OnInit, Input, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService, CustomerService, EmployeeServiceProxy, DataDictionaryService } from 'services'
import { ModalComponentBase } from '@shared/component-base';
import { Project } from 'entities'
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-or-update-project',
  templateUrl: './create-or-update-project.component.html',
  styleUrls: ['./create-or-update-project.component.scss']
})
export class CreateOrUpdateProjectComponent extends ModalComponentBase implements OnInit {
  @Input() id: any;
  title: string;
  projectMode = [{ text: "内部", value: 1 }, { text: "合伙", value: 2 }, { text: "外部", value: 3 }];
  projectStatus = [{ "text": "线索", "value": 1 }
    , { text: "立项", value: 2 }
    , { text: "进行中", value: 3 }
    , { text: "已完成", value: 4 }
    , { text: "已回款", value: 5 }
    , { text: "取消", value: 0 }];
  typeList: any;
  customerList: any;
  employeeList: any;
  form: FormGroup;
  // isShow = false;
  project: Project = new Project();
  constructor(injector: Injector, private projectService: ProjectService, private datePipe: DatePipe, private customerService: CustomerService
    , private employeeServiceProxy: EmployeeServiceProxy, private router: Router
    , private dataDictionaryService: DataDictionaryService, private fb: FormBuilder) { super(injector); }

  ngOnInit() {
    this.project.projectCode = 'HC' + this.datePipe.transform(new Date(), 'yyyyMMddHHmmss')
    this.form = this.fb.group({
      mode: [null, Validators.compose([Validators.required])],
      profitRatio: [null, Validators.compose([Validators.maxLength(18)])],
      billCost: [null, Validators.compose([Validators.maxLength(18)])],
      projectCode: [null, Validators.compose([Validators.maxLength(50), Validators.required])],
      name: [null, Validators.compose([Validators.maxLength(100), Validators.required])],
      budget: [null, Validators.compose([Validators.maxLength(18)])],
      desc: [null, Validators.compose([Validators.maxLength(250)])],
      type: [null],
      customerId: [null],
      employeeId: [null],
      startDate: [null],
      endDate: [null],
      year: [null],
      status: [null],
    });
    this.getCustomerList();
    this.getEmployeeList();
    this.getTypeList();
    this.project.status = 1;
    if (this.id) {
      this.getData();
      this.title = "编辑项目";
    } else {
      this.title = "新增项目";
    }
  }

  // profitRatioWhetherShow() {
  //   if (this.project.mode == 2)
  //     this.isShow = true;
  //   else
  //     this.isShow = false;
  // }

  getTypeList() {
    this.dataDictionaryService.getDropDownDtos("1").subscribe((result) => {
      this.typeList = result;
    });
  }

  getCustomerList() {
    this.customerService.getDropDownDtos().subscribe((result) => {
      this.customerList = result;
    });
  }

  getEmployeeList() {
    this.employeeServiceProxy.getDropDownDtos().subscribe((result) => {
      this.employeeList = result;
    });
  }

  getData() {
    this.projectService.getForEdit(this.id).subscribe((result) => {
      this.project = result;
    });
  }

  //保存并添加明细
  preservation() {
    this.projectService.createOrUpdate(this.project).finally(() => {
      this.saving = false;
    }).subscribe((result: any) => {
      console.log(result);
      this.notify.success('保存成功！');
      this.router.navigate(['/app/pm/dprojectoc-detail', { id: result.data.id }]);
      // this.success();
    });
    // this.router.navigate(['/app/pm/invoice-detail', { id: id }]);
  }

  //保存
  save() {
    this.projectService.createOrUpdate(this.project).finally(() => {
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

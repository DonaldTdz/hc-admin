import { Component, OnInit, Injector, Input, EventEmitter, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ProjectService, CustomerService, EmployeeServiceProxy, DataDictionaryService
  , ProjectDetailService, CustomerContactService
} from 'services';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Project } from 'entities';
import { ModifyProjectdetailComponent } from '../modify-projectdetail/modify-projectdetail.component'
import { PagedResultDto } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-modify-project',
  templateUrl: './modify-project.component.html',
  styleUrls: ['./modify-project.component.scss'],
  providers: [CustomerContactService]
})
export class ModifyProjectComponent extends AppComponentBase implements OnInit {
  @Input() projectId;
  @Input() prjectName;
  @Output() voted = new EventEmitter<string>();
  @Output() updateStep = new EventEmitter<string>();
  loading = 'false';
  projectTitle: any;
  totalAmount: number = 0;
  title: string;
  editIndex = -1;
  current = 0;
  projectCustomerId: string;
  typeList: any;
  employeeList: any;
  editObj = {};
  customerList: any;
  CustomerContacts: any;
  projectMode = [{ text: "内部", value: 1 }, { text: "合伙", value: 2 }, { text: "外部", value: 3 }];
  project: Project = new Project();
  form: FormGroup;
  projectFrom: FormGroup;

  constructor(injector: Injector, private projectService: ProjectService, private customerService: CustomerService
    , private projectDetailService: ProjectDetailService, private nzMsg: NzMessageService
    , private customerContactService: CustomerContactService, private employeeServiceProxy: EmployeeServiceProxy
    , private dataDictionaryService: DataDictionaryService, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit() {
    this.form = this.fb.group({
      mode: [null, Validators.compose([Validators.required])],
      implementMoney: [null, Validators.compose([Validators.maxLength(18), Validators.required])],
      projectSalesId: [null, Validators.compose([Validators.required])],
      salesAssistantId: [null, Validators.compose([Validators.required])],
      customerContactId: [null, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.maxLength(100), Validators.required])],
      desc: [null, Validators.compose([Validators.maxLength(250)])],
      type: [null, Validators.compose([Validators.required])],
      customerId: [null, Validators.compose([Validators.maxLength(50), Validators.required])],
      billCost: [null],
      budget: [null],
      profitRatio: [null],
      startDate: [null],
      endDate: [null],
      status: [null],
      projectDetails: this.fb.array([])
    });
    if (!this.projectId) {
      this.project.implementMoney = 0;
      this.project.statusName = "线索";
      this.project.status = 1;
      this.project.mode = 1;
      this.title = "新建项目";
    } else {
      this.title = "项目详情";
      this.project.id = this.projectId;
      this.getProjectById();
      this.getProjectDetail();
    }
    this.getTypeList();
    this.getEmployeeList();
    this.getCustomerList();
  }

  //获取项目详情
  getProjectById() {
    this.projectService.getById(this.projectId).subscribe((result) => {
      this.project = result;
      this.projectTitle = "项目编号：" + this.project.projectCode + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0项目名称：" + this.project.name;
    });
  }

  //刷新状态
  vote() {
    this.voted.emit(this.project.id);
  }

  //获取项目类型
  getTypeList() {
    this.dataDictionaryService.getDropDownDtos("1").subscribe((result) => {
      this.typeList = result;
    });
  }

  //获取生成的项目编号
  generateProjectCode() {
    this.projectService.generateProjectCode(this.project.type).subscribe((result) => {
      this.project.projectCode = result;
      this.projectTitle = "项目编号：" + this.project.projectCode;
    });
  }

  //获取客户列表
  getCustomerList() {
    this.customerService.getDropDownDtos().subscribe((result) => {
      this.customerList = result;
    });
  }

  //丢单
  loseOrder() {
    // let index = this.projectStatus.indexOf(this.project.statusName);
    // this.projectStatus=this.projectStatus.
    // this.project.statusName = "丢单";
    this.project.status = 6;
    this.projectService.modifyProjectStatusAsync(this.project.id, this.project.status).subscribe((result) => {
      if (result._isScalar == true) {
        this.getProjectById();
        this.updateStep.emit(this.project.statusName);
      }
    });
  }

  //获取客户联系人
  async getDeptNameAndContacts() {
    if (this.project.customerId) {
      await this.customerContactService.getContactByCustomerId(this.project.customerId.toString())
        .subscribe((result) => {
          this.CustomerContacts = result;
        });
    }
  }

  //立项
  async submit() {
    // this.projectTitle = "项目编号：" + this.project.projectCode + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0项目名称：" + this.project.name;
    if (!this.project.id)
      return this.nzMsg.warning("请先保存")

    this.project.status = 2;
    await this.projectService.modifyProjectStatusAsync(this.project.id, this.project.status).subscribe((result) => {
      if (result._isScalar == true) {
        this.vote();
      }
    });

    // this.prjectName = '立项';
  }

  //完成立项
  async tenders() {
    if (this.project.status == 2 && !this.project.budget)
      return this.nzMsg.warning("销售预算金额不能为空");
    await this.save();

    this.project.status = 3;
    await this.projectService.modifyProjectStatusAsync(this.project.id, this.project.status).subscribe((result) => {
      if (result._isScalar == true) {
        this.vote();
      }
    });
  }

  //获取销售人员列表
  getEmployeeList() {
    this.employeeServiceProxy.getDropDownDtos().subscribe((result) => {
      this.employeeList = result;
    });
  }

  //预计成本
  estimatedCost() {
    this.modalHelper.open(ModifyProjectdetailComponent, { 'projectId': this.project.id }, 'lg', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(isSave => {
      if (isSave) {
        this.getProjectDetail();
      }
    });
  }

  projectDetail(): FormGroup {
    return this.fb.group({
      id: [null],
      projectId: [null],
      name: [null, [Validators.required]],
      num: [null, [Validators.required]],
      price: [null, [Validators.required]],
    });
  }

  getProjectDetail() {
    this.loading = 'true';
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.projectId = this.project.id;
    this.projectDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = "false";
      for (let item of result.items) {
        this.totalAmount += parseFloat(item.num) * item.price;
        const field = this.projectDetail();
        field.patchValue(item);
        this.projectDetails.push(field);
      }
    });
  }

  get projectDetails() {
    return this.form.controls.projectDetails as FormArray;
  }



  //保存
  save() {
    if (this.project.status == 2 && !this.project.budget)
      return this.nzMsg.warning("销售预算金额不能为空");
    if (this.project.mode == 2 && !this.project.profitRatio)
      return this.nzMsg.warning("收益比例不能为空");
    if (this.project.mode == 3 && !this.project.billCost)
      return this.nzMsg.warning("过单费用不能为空");
    this.projectService.createOrUpdate(this.project).finally(() => {
    }).subscribe((result: any) => {
      if (result.code == 1) {
        this.project.id = result.data.id;
        this.nzMsg.success(result.msg);
      } else {
        this.project.status = 1;
        this.project.statusName = "线索";
        this.nzMsg.error(result.msg);
      }
    });
  }

  //删除成本
  del(index: number, id: any) {
    this.totalAmount -= parseFloat(this.projectDetails.value[index].num) * this.projectDetails.value[index].price;
    this.projectDetails.removeAt(index);
    this.projectDetailService.delete(id).subscribe(() => {
      this.notify.success('删除成功！');
    });
  }

  //新增成本
  add() {
    this.projectDetails.push(this.projectDetail());
    this.edit(this.projectDetails.length - 1);
  }

  //修改成本
  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.projectDetails.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.projectDetails.at(index).value };
    this.editIndex = index;
    this.totalAmount -= parseFloat(this.projectDetails.value[index].num) * this.projectDetails.value[index].price;
  }

  //保存成本
  async saveProjectDetail(index: number) {
    this.projectDetails.at(index).markAsDirty();
    if (this.projectDetails.at(index).invalid) return;
    this.editIndex = -1;
    this.totalAmount += parseFloat(this.projectDetails.value[index].num) * this.projectDetails.value[index].price;
    this.projectDetails.value[index].projectId = this.project.id;
    await this.projectDetailService.createOrUpdate(this.projectDetails.value[index])
      .subscribe((result: any) => {
        this.notify.success("保存成功");
        this.projectDetails.value[index].id = result.id;
      });
  }

  //取消成本
  cancel(index: number, id: any) {
    if (!this.projectDetails.at(index).value.id) {
      this.projectDetails.removeAt(index);
    } else {
      this.del(index, id);
    }
    this.editIndex = -1;
  }

}

import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/component-base';
import {
  ProjectService, CustomerService, EmployeeServiceProxy, DataDictionaryService
  , ProjectDetailService, CustomerContactService
} from 'services';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from 'entities';

@Component({
  selector: 'app-modify-project',
  templateUrl: './modify-project.component.html',
  styleUrls: ['./modify-project.component.scss'],
  providers: [CustomerContactService]
})
export class ModifyProjectComponent extends AppComponentBase implements OnInit {
  id: any = '';
  loading = 'false';
  title: string;
  current = 0;
  projectCustomerId: string;
  typeList: any;
  employeeList: any;
  customerList: any;
  CustomerContacts: any;
  projectStatus = ["线索", "立项", "招标", "执行"];
  projectMode = [{ text: "内部", value: 1 }, { text: "合伙", value: 2 }, { text: "外部", value: 3 }];
  project: Project = new Project();
  form: FormGroup;

  constructor(injector: Injector, private projectService: ProjectService, private datePipe: DatePipe
    , private customerService: CustomerService, private projectDetailService: ProjectDetailService
    , private customerContactService: CustomerContactService
    , private employeeServiceProxy: EmployeeServiceProxy, private router: Router, private actRouter: ActivatedRoute
    , private dataDictionaryService: DataDictionaryService, private fb: FormBuilder) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    // this.project.projectCode = 'HC' + this.datePipe.transform(new Date(), 'yyyyMMddHHmmss');
    this.form = this.fb.group({
      mode: [null, Validators.compose([Validators.required])],
      implementMoney: [null, Validators.compose([Validators.maxLength(18)])],
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
    });
    if (!this.id) {
      this.project.implementMoney = 0;
      this.project.statusName = "线索";
      this.project.status = 1;
      this.project.mode = 1;
      this.title = "新建项目";
    } else {
      this.title = "项目详情";
      this.project.id = this.id;
      this.getProjectById();
    }
    this.getTypeList();
    this.getEmployeeList();
    this.getCustomerList();
  }

  //获取项目详情
  getProjectById() {
    this.projectService.getById(this.id).subscribe((result) => {
      this.project = result;
    });
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
    });
  }

  //获取客户联系人
  // getCustomerContact() {
  //   for (let customer of this.customers) {
  //     if (customer.value == this.project.customerId)
  //       this.project.customerContact = customer.text;
  //     else
  //       this.project.customerContact = '';
  //   }
  // }

  //获取客户列表
  getCustomerList() {
    this.customerService.getDropDownDtos().subscribe((result) => {
      this.customerList = result;
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
  submit() {
    this.project.statusName = "立项";
    this.save();
  }

  step(item: any) {
    let bb = item.path[0].innerText;
    this.project.statusName = bb;
    // if (bb == "线索" && this.project.status == 1)
    //   this.project.statusName = bb;
    // else if (bb == "立项" && this.project.status == 2)
    //   this.project.statusName = bb;
    // else if (bb == "招标" && this.project.status == 3)
    //   this.project.statusName = bb;
    // else if (bb == "执行" && this.project.status == 4)
    //   this.project.statusName = bb;
  }

  //获取销售人员列表
  getEmployeeList() {
    this.employeeServiceProxy.getDropDownDtos().subscribe((result) => {
      this.employeeList = result;
    });
  }

  //返回
  goBack(): void {
    history.back();
  }

  //保存
  save() {
    if (this.project.status == 2 && !this.project.budget)
      return this.notify.warn("销售预算金额不能为空");
    if (this.project.mode == 2 && !this.project.profitRatio)
      return this.notify.warn("收益比例不能为空");
    if (this.project.mode == 3 && !this.project.billCost)
      return this.notify.warn("过单费用不能为空");
    if (this.project.statusName == "立项")
      this.project.status = 2;
    this.projectService.createOrUpdate(this.project).finally(() => {
    }).subscribe((result: any) => {
      if (result.code == 1) {
        this.project.id = result.data.id;
        this.notify.success(result.msg);
      } else {
        this.project.status = 1;
        this.project.statusName = "线索";
        this.notify.error(result.msg);
      }
    });
  }

}

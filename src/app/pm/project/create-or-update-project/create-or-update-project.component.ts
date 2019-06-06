import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {
  ProjectService, CustomerService, EmployeeServiceProxy, DataDictionaryService
  , ProjectDetailService
} from 'services';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { AppComponentBase } from '@shared/app-component-base';
import { Project, ProjectDetail } from 'entities'
import { DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import { CreateOrUpdateProjectdetailComponent } from '../create-or-update-projectdetail/create-or-update-projectdetail.component'

@Component({
  selector: 'app-create-or-update-project',
  templateUrl: './create-or-update-project.component.html',
  styleUrls: ['./create-or-update-project.component.scss']
})
export class CreateOrUpdateProjectComponent extends AppComponentBase implements OnInit {
  @Input() id: any;
  @Output() voted = new EventEmitter<boolean>();
  loading = 'false';
  title: string;
  projectDetails = [];
  projectStatus = ["立项", "招标", "合同", "收款", "已完成", "丢单"];
  projectMode = [{ text: "内部", value: 1 }, { text: "合伙", value: 2 }, { text: "外部", value: 3 }];
  // projectStatus = [{ "text": "立项", "value": 1 }
  //   , { text: "招标", value: 2 }
  //   , { text: "合同", value: 3 }
  //   , { text: "收款", value: 4 }
  //   , { text: "已完成", value: 5 }
  //   , { text: "丢单", value: 6 }];
  typeList: any;
  customerList: any;
  employeeList: any;
  // projectCode: string;
  projectForm: FormGroup;
  project: Project = new Project();
  constructor(injector: Injector, private projectService: ProjectService, private datePipe: DatePipe, private location: Location
    , private customerService: CustomerService, private projectDetailService: ProjectDetailService
    , private employeeServiceProxy: EmployeeServiceProxy, private router: Router
    , private dataDictionaryService: DataDictionaryService, private fb: FormBuilder) { super(injector); }

  ngOnInit() {
    this.project.projectCode = 'HC' + this.datePipe.transform(new Date(), 'yyyyMMddHHmmss')
    this.projectForm = this.fb.group({
      mode: [null, Validators.compose([Validators.required])],
      profitRatio: [null, Validators.compose([Validators.maxLength(18)])],
      billCost: [null, Validators.compose([Validators.maxLength(18)])],
      projectCode: [null, Validators.compose([Validators.maxLength(50), Validators.required])],
      name: [null, Validators.compose([Validators.maxLength(100), Validators.required])],
      budget: [null, Validators.compose([Validators.maxLength(18)])],
      desc: [null, Validators.compose([Validators.maxLength(250)])],
      type: [null],
      customerId: [null],
      employeeId: [null, Validators.compose([Validators.required])],
      startDate: [null],
      endDate: [null],
      year: [null, Validators.compose([Validators.required])],
      status: [null],
      // projectDetails: this.fb.array([]),
    });
    this.getCustomerList();
    this.getEmployeeList();
    this.getTypeList();
    this.project.status = 1;
    if (this.id) {
      this.getProjectDetails();
      this.getData();
    } else {
      this.title = "新增项目";
      this.project.statusName = "立项";
      this.project.status = 1;
    }
  }

  //获取项目明细列表
  getProjectDetails() {
    this.loading = 'true';
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.projectId = this.id;
    this.projectDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = "false"
      this.projectDetails = result.items;
    })
  }

  //创建项目明细
  createProjectDetail() {
    this.modalHelper.open(CreateOrUpdateProjectdetailComponent, { projectId: this.project.id }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: any) => {
      if (!this.project.id) {
        if (result) {
          result.totalSum = result.price * result.num;
          this.projectDetails.push(result);
        }
      } else {
        this.getProjectDetails();
      }
    });
  }

  //编辑项目明细
  editProjectDetail(projectDetail: ProjectDetail, index: number) {
    if (!this.project.id) {
      this.modalHelper.open(CreateOrUpdateProjectdetailComponent, { projectDetail }, 'md', {
        nzMask: true
      }).subscribe((result: any) => {
        if (!this.project.id) {
          if (result) {
            result.totalSum = result.price * result.num;
            this.projectDetails.splice(index, 1, result);
          }
        }
      });
    } else {
      this.modalHelper.open(CreateOrUpdateProjectdetailComponent, { id: projectDetail.id }, 'md', {
        nzMask: true
      }).subscribe(isSave => {
        if (isSave) {
          this.getProjectDetails();
        }
      });
    }
  }

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
    this.projectService.getById(this.id).subscribe((result) => {
      this.project = result;
    });
  }

  goBack(): void {
    this.router.navigate(['/app/pm/project']);
  }

  //丢单
  losing() {
    this.project.status = 6;
    this.project.statusName = "丢单";
    this.save();
  }

  //提交
  submit() {
    if (this.projectDetails.length < 1)
      return this.notify.warn("请先新增项目明细");
    this.project.status = 2;
    this.project.statusName = "招标";
    this.save();
  }

  //刷新状态
  vote(status: boolean) {
    this.voted.emit(status);
  }

  //删除
  delete(projectDetail: ProjectDetail, index: number) {
    if (projectDetail.id) {
      this.message.confirm(
        "是否删除该项目明细:'" + projectDetail.name + "'?(请谨慎删除)",
        "信息确认",
        (result: boolean) => {
          if (result) {
            this.projectDetailService.delete(projectDetail.id).subscribe(() => {
              this.notify.success('删除成功！');
              this.getProjectDetails();
            });
          }
        }
      )
    } else {
      this.projectDetails.splice(index, 1)
    }
  }


  //保存
  save() {
    if (this.id) {
      this.projectService.createOrUpdate(this.project).finally(() => {
      }).subscribe((result: any) => {
        if (result.code == 1) {
          this.notify.success(result.msg);
          this.vote(true);
          // if (result.data)
          //   this.router.navigate(['/app/pm/projectoc-detail', { id: result.data.id, projectStatus: result.data.status }]);
        } else {
          this.notify.error(result.msg);
        }
      });
    } else {
      this.projectService.createProjectAndDetail(this.project, this.projectDetails).finally(() => {
      }).subscribe((result: any) => {
        if (result.code == 1) {
          this.notify.success(result.msg);
          if (result.data)
            this.router.navigate(['/app/pm/projectoc-detail', { id: result.data.id }]);
        } else {
          this.notify.error(result.msg);
        }
      });
    }
  }
}

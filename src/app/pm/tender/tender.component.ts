import { Component, OnInit, Injector, Output, Input, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { TenderService, EmployeeServiceProxy, DataDictionaryService, ProjectService } from 'services'
import { Tender } from 'entities'
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateTenderDataComponent } from './create-tenderdata/create-tenderdata.component';
import { FileComponent } from '../file/file.component';

@Component({
  selector: 'app-tender',
  templateUrl: './tender.component.html',
  styleUrls: ['./tender.component.scss']
})
export class TenderComponent extends AppComponentBase implements OnInit {
  tender: Tender = new Tender();
  tenderDatas: any;
  qualifications: any;
  form: FormGroup;
  @Input() projectId;
  @Input() projectCode;
  @Input() projectName;
  @Input() projectStatus;
  @Output() updateStep = new EventEmitter<string>();
  employeeList: any;
  projectTitle: string = '';
  readyEmployeeIds: any;
  postUrl: string = '/File/DocFilesPostsAsync';
  uploadLoading = false;
  search: any = {};
  constructor(injector: Injector, private tenderService: TenderService
    , private fb: FormBuilder, private employeeServiceProxy: EmployeeServiceProxy
    , private dataDictionaryService: DataDictionaryService, private projectService: ProjectService,
    private nzMessage: NzMessageService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      projectId: [null],
      bidPurchaser: [null, Validators.compose([Validators.required, Validators.maxLength(25)])],
      buyBidingPerson: [null, Validators.compose([Validators.maxLength(25), Validators.required])],
      purchaseStartDate: [null, Validators.compose([Validators.required])],
      purchaseEndDate: [null, Validators.compose([Validators.required])],
      voucher: [null, Validators.compose([Validators.maxLength(255)])],
      purchaseInformation: [null],
      attachments: [null, Validators.compose([Validators.maxLength(255)])],
      preparationPerson: [null, Validators.compose([Validators.maxLength(255), Validators.required])],
      tenderTime: [null, Validators.compose([Validators.required])],
      bond: [null, Validators.compose([Validators.required])],
      bondTime: [null, Validators.compose([Validators.required])],
      isPayBond: [null],
      qualification: [null],
      organizer: [null, Validators.compose([Validators.required, Validators.maxLength(25)])],
      inspector: [null, Validators.compose([Validators.required, Validators.maxLength(25)])],
      binder: [null, Validators.compose([Validators.required, Validators.maxLength(25)])]
    });
    if (this.projectCode && this.projectName)
      this.projectTitle = "项目编号：" + this.projectCode + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0项目名称：" + this.projectName;
    this.getEmployeeList();
    this.getTender();
  }

  //查询
  getTender() {
    this.tenderService.getById('', this.projectId).subscribe((result) => {
      this.tender = result;

      this.getTenderDatas();
      this.getQualifications();
      // if (!result.id)
      //   this.tender.projectId = this.projectId;
      // else
      //   this.readyEmployeeIds = this.tender.readyEmployeeIds.split(",");
      // this.jointAttachments()
    });
  }

  //新增招标资料
  addTenderData() {
    this.modalHelper.open(CreateTenderDataComponent, {}, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: any) => {
      if (result) {
        if (result.status == 1) {
          let qualification = { value: result.value, text: result.value };
          this.qualifications.push(qualification);
        }
        let tenderData = { value: result.value, text: result.value };
        this.tenderDatas.push(tenderData);
      }
    });
  }

  //新增招标资料
  addQualification() {
    this.modalHelper.open(CreateTenderDataComponent, {}, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: any) => {
      if (result) {
        if (result.status == 1) {
          let tenderData = { value: result.value, text: result.value };
          this.tenderDatas.push(tenderData);
        }
        let qualification = { value: result.value, text: result.value };
        this.qualifications.push(qualification);
      }
    });
  }


  //获取项目下拉列表
  getTenderDatas() {
    this.dataDictionaryService.getDropDownDtos("6").subscribe((result) => {
      this.tenderDatas = result;
      let items = [];
      let index = -1;
      if (this.tender.purchaseInformation) {
        for (let item of this.tenderDatas) {
          items.push(item.value);
        }
        for (let item of this.tender.purchaseInformation.split(",")) {
          if (items.indexOf(item) > -1)
            continue;
          else
            this.tenderDatas.push({ value: item, text: item })
        }
        for (let item of this.tenderDatas) {
          index += 1;
          this.tender.purchaseInformation.match(item.value) ? item.checked = true : item.checked = false;
          this.tenderDatas[index] = item;
        }
      }
    });
  }

  getQualifications() {
    this.dataDictionaryService.getDropDownDtos("6").subscribe((result) => {
      this.qualifications = result;
      let items = [];
      let index = -1;
      if (this.tender.qualification) {
        for (let item of this.qualifications) {
          items.push(item.value);
        }
        for (let item of this.tender.qualification.split(",")) {
          if (items.indexOf(item) > -1)
            continue;
          else
            this.qualifications.push({ value: item, text: item })
        }
        for (let item of this.qualifications) {
          index += 1;
          this.tender.qualification.match(item.value) ? item.checked = true : item.checked = false;
          this.qualifications[index] = item;
        }
      }
    });
  }

  //获取人员下拉列表
  getEmployeeList() {
    this.employeeServiceProxy.getDropDownDtos().subscribe((result) => {
      this.employeeList = result;
    });
  }


  //未中标
  async loseABid() {
    this.tender.isWinbid = false;
    this.projectStatus = 6;
    await this.tenderService.createOrUpdate(this.tender).finally(() => {
    }).subscribe(() => {
      this.notify.success(this.l('中标状态修改成功'));
    });
    await this.projectService.modifyProjectStatusAsync(this.projectId, this.projectStatus).subscribe((result) => {
      if (result == true) {
        this.updateStep.emit("丢单");
      }
    });
  }

  //中标
  async winningBid() {
    if (!this.tender.id)
      return this.nzMessage.warning("请先保存招标信息");
    if (!this.tender.attachments || !this.tender.voucher)
      return this.nzMessage.warning("招标文件或标书凭证不能为空");
    this.tender.isWinbid = true;
    this.projectStatus = 4;
    await this.tenderService.createOrUpdate(this.tender).finally(() => {
    }).subscribe(() => {
      this.notify.success(this.l('中标状态修改成功'));
    });
    await this.projectService.modifyProjectStatusAsync(this.projectId, this.projectStatus).subscribe((result) => {
      if (result == true) {
        this.updateStep.emit("执行");
      }
    });
  }


  //上传招标文件
  attachments() {
    this.modalHelper.open(FileComponent, { 'attachment': this.tender.attachments }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: any) => {
      if (result)
        this.tender.attachments = result;
      else
        this.tender.attachments = '';
    });
  }

  //上传标书凭证
  voucher() {
    this.modalHelper.open(FileComponent, { 'attachment': this.tender.voucher }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: any) => {
      if (result)
        this.tender.voucher = result;
      else
        this.tender.voucher = '';
    });
  }
  purchaseCallback(value: string[]): void {
    this.tender.purchaseInformation = value.join();
  }

  qualificationCallback(value: string[]): void {
    this.tender.qualification = value.join();
  }

  save() {
    this.tender.projectId = this.projectId;
    // for (const i in this.form.controls) {
    //   this.form.controls[i].markAsDirty();
    //   this.form.controls[i].updateValueAndValidity();
    // }
    if (!this.tender.purchaseInformation) {
      return this.nzMessage.warning("请选择购买资料");
    }
    if (!this.tender.qualification) {
      return this.nzMessage.warning("请选择资质证明");
    }
    this.tenderService.createOrUpdate(this.tender).finally(() => {
    }).subscribe((result) => {
      this.tender.id = result.id;
      this.notify.success('保存成功！');
      // this.getTender();
    });
  }

}

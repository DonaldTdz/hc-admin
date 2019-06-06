import { Component, OnInit, Injector, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { TenderService, ProjectService, EmployeeServiceProxy } from 'services'
import { Tender } from 'entities'
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DetailProjectComponent } from '../project/detail-project/detail-project.component'

@Component({
  selector: 'app-tender',
  templateUrl: './tender.component.html',
  styleUrls: ['./tender.component.scss']
})
export class TenderComponent extends AppComponentBase implements OnInit {
  tender: Tender = new Tender();
  projectList: any;
  form: FormGroup;
  projectIdDisabled = false;

  @Input() projectId;
  @Input() projectStatus;
  @Output() voted = new EventEmitter<boolean>();
  employeeList: any;
  readyEmployeeIds: any;
  uploadDisabled = false;
  attachments = [];
  postUrl: string = '/File/DocFilesPostsAsync';
  uploadLoading = false;
  search: any = {};
  constructor(injector: Injector, private tenderService: TenderService, private projectService: ProjectService
    , private fb: FormBuilder, private employeeServiceProxy: EmployeeServiceProxy,
    private nzMessage: NzMessageService, private router: Router) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      projectId: [null, Validators.compose([Validators.required])],
      tenderTime: [null, Validators.compose([Validators.required])],
      bond: [null, Validators.compose([Validators.maxLength(18)])],
      bondTime: [null, Validators.compose([Validators.required])],
      isPayBond: [null],
      readyTime: [null, Validators.compose([Validators.required])],
      isReady: [null],
      employeeId: [null, Validators.compose([Validators.required])],
      readyEmployeeIds: [null, Validators.compose([Validators.required])]
    });
    this.getProjectList();
    this.getEmployeeList();
    this.getTender();
    this.projectIdDisabled = true;
    // console.log('222' + this.projectStatus)
  }

  //查询
  getTender() {
    this.tenderService.getById('', this.projectId).subscribe((result) => {
      this.tender = result;
      if (!result.id)
        this.tender.projectId = this.projectId;
      else
        this.readyEmployeeIds = this.tender.readyEmployeeIds.split(",");
      this.jointAttachments()
    });
  }

  //刷新状态
  vote(status: boolean) {
    this.voted.emit();
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

  //处理附件
  jointAttachments() {
    if (this.tender.attachments) {
      let items = this.tender.attachments.split(",");
      let arr = [];
      for (let item of items) {
        let fileName = item.split(":")[0];
        let fileUrl = item.split(":")[1];
        let map = { "fileName": fileName, "fileUrl": fileUrl };
        arr.push(map);
      }
      this.attachments = arr;
    } else {
      this.attachments = []
    }
    if (this.attachments.length >= 6)
      this.uploadDisabled = true;
    else
      this.uploadDisabled = false;
  }

  //修改招标状态
  modifyIsWinbid(type: string) {
    if (!this.tender.tenderTime)
      return this.nzMessage.warning("招标时间不能为空");
    else if (!this.tender.isPayBond || !this.tender.bond)
      return this.nzMessage.warning("请先交纳保证金");
    else if (!this.tender.isReady)
      return this.nzMessage.warning("请先完成准备");
    else if (!this.tender.attachments)
      return this.nzMessage.warning("请先上传附件");
    else if (type == 'loseABid')
      this.loseABid();
    else
      this.winningBid();

    // location.reload();
    // this.vote()
    // if (type == 'loseABid')
    //   this.loseABid();
    // else
    //   this.winningBid();
  }


  //未中标
  loseABid() {
    this.tender.isWinbid = false;
    this.tenderService.createOrUpdate(this.tender).finally(() => {
    }).subscribe(() => {
      this.notify.success(this.l('中标状态修改成功'));
      this.vote(true);
    });
  }

  //中标
  winningBid() {
    this.tender.isWinbid = true;
    this.tenderService.createOrUpdate(this.tender).finally(() => {
    }).subscribe(() => {
      this.notify.success(this.l('中标状态修改成功'));
      this.vote(true);
    });
  }

  beforeUpload = (): boolean => {
    if (this.uploadLoading) {
      this.notify.info('正在上传中');
      return false;
    }
    this.uploadLoading = true;
    return true;
  }

  handleChange = (info: { file: UploadFile }): void => {
    if (info.file.status === 'error') {
      this.notify.error('上传文件异常，请重试');
      this.uploadLoading = false;
    }
    if (info.file.status === 'done') {
      this.uploadLoading = false;
      var res = info.file.response.result;
      //console.table(info.file.response.result);
      if (res.code == 0) {
        this.notify.success('上传文件成功');
        let fileName = res.data.name;
        let filePath = res.data.url;
        // this.setFormValues(this.attachment);
        if (this.tender.attachments)
          this.tender.attachments = this.tender.attachments + "," + fileName + ":" + filePath;
        else
          this.tender.attachments = fileName + ":" + filePath;
        this.jointAttachments()
      } else {
        this.notify.error(res.msg);
      }
    }
  }

  //删除附件
  deleteAttachment(item: any) {
    let dateleString = "," + item.fileName + ":" + item.fileUrl;
    let items = this.tender.attachments.replace(dateleString, '');
    if (this.tender.attachments == items) {
      dateleString = item.fileName + ":" + item.fileUrl + ",";
      items = this.tender.attachments.replace(dateleString, '');
      if (this.tender.attachments == items) {
        dateleString = item.fileName + ":" + item.fileUrl;
        items = this.tender.attachments.replace(dateleString, '');
        this.tender.attachments = items;
        this.jointAttachments();
      } else {
        this.tender.attachments = items;
        this.jointAttachments();
      }
    } else {
      this.tender.attachments = items;
      this.jointAttachments();
    }
  }

  save() {
    this.tender.readyEmployeeIds = this.readyEmployeeIds.join(',');
    this.tenderService.createOrUpdate(this.tender).finally(() => {
    }).subscribe(() => {
      this.notify.success('保存成功！');
      this.getTender();
    });
  }

}

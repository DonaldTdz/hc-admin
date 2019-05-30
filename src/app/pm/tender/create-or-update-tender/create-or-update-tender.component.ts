import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tender } from 'entities'
import { TenderService, ProjectService, EmployeeServiceProxy } from 'services'
import { UploadFile } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-or-update-tender',
  templateUrl: './create-or-update-tender.component.html',
  styleUrls: ['./create-or-update-tender.component.scss']
})
export class CreateOrUpdateTenderComponent extends ModalComponentBase implements OnInit {
  @Input() id: number;
  @Input() projectId: string;
  projectIdDisabled = false;
  title: string;
  form: FormGroup;
  projectList: any;
  employeeList: any;
  readyEmployeeIds: any;
  uploadDisabled = false;
  attachments = [];
  postUrl: string = '/File/DocFilesPostsAsync';
  uploadLoading = false;
  tender: Tender = new Tender();
  constructor(injector: Injector, private tenderService: TenderService, private fb: FormBuilder, private projectService: ProjectService
    , private employeeServiceProxy: EmployeeServiceProxy, private router: Router) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      projectId: [null, Validators.compose([Validators.required])],
      tenderTime: [null, Validators.compose([Validators.required])],
      bond: [null, Validators.compose([Validators.maxLength(18)])],
      bondTime: [null],
      isPayBond: [null],
      readyTime: [null, Validators.compose([Validators.required])],
      isReady: [null],
      employeeId: [null],
      readyEmployeeIds: [null]
    });
    this.getProjectList();
    this.getEmployeeList();
    if (this.projectId) {
      this.tender.projectId = this.projectId;
      this.projectIdDisabled = true;
    }
    if (this.id) {
      this.getData();
      this.title = "编辑招标";
    } else {
      this.title = "新增招标";
    }
  }

  //编辑获取数据
  getData() {
    // this.tenderService.getById(this.id.toString()).subscribe((result) => {
    //   this.tender = result;
    //   this.readyEmployeeIds = this.tender.readyEmployeeIds.split(",");
    //   this.jointAttachments()
    // });
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
    this.tender.readyEmployeeIds = this.readyEmployeeIds.join(',');
    this.tenderService.createOrUpdate(this.tender).finally(() => {
      this.saving = false;
    }).subscribe(() => {
      this.notify.success('保存成功！');
      this.success();
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
      this.uploadDisabled = true
  }

  beforeUpload = (file: UploadFile): boolean => {
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

}

import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contract } from 'entities'
import { ContractService, ProjectService, PurchaseService } from 'services'
import { UploadFile } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-or-update-contract',
  templateUrl: './create-or-update-contract.component.html',
  styles: []
})
export class CreateOrUpdateContractComponent extends ModalComponentBase implements OnInit {
  @Input() id: number;
  title: string;
  form: FormGroup;
  refList: any;
  purchaseList: any;
  projectList: any;
  uploadDisabled = false;
  attachments = [];
  contractType = [{ text: '销项', value: 1 }, { text: '进项', value: 2 }];
  postUrl: string = '/File/DocFilesPostsAsync';
  uploadLoading = false;
  contract: Contract = new Contract();

  constructor(injector: Injector, private contractService: ContractService, private fb: FormBuilder, private projectService: ProjectService
    , private purchaseService: PurchaseService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      type: [null, Validators.compose([Validators.required])],
      contractCode: [null, Validators.compose([Validators.required, Validators.maxLength(35)])],
      refId: [null],
      signatureTime: [null],
      amount: [null, Validators.compose([Validators.maxLength(18)])],
      desc: [null, Validators.compose([Validators.maxLength(250)])]
    });
    if (this.id) {
      this.getData();
      this.title = "编辑合同";
    } else {
      this.title = "新增合同";
    }
    this.getProjectList();
    this.getPurchaseList();
  }

  //编辑获取数据
  getData() {
    this.contractService.getById(this.id.toString()).subscribe((result) => {
      this.contract = result;
      this.jointAttachments()
    });
  }

  getRefList() {
    if (this.contract.type == 1)
      this.refList = this.projectList;
    else
      this.refList = this.purchaseList;
  }

  //获取项目下拉列表
  getProjectList() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projectList = result;
    });
  }

  //获取采购下拉列表
  getPurchaseList() {
    this.purchaseService.getDropDownDtos().subscribe((result) => {
      this.purchaseList = result;
    });
  }

  save() {
    this.contractService.createOrUpdate(this.contract).finally(() => {
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

  //处理附件
  jointAttachments() {
    if (this.contract.attachments) {
      let items = this.contract.attachments.split(",");
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
        if (this.contract.attachments)
          this.contract.attachments = this.contract.attachments + "," + fileName + ":" + filePath;
        else
          this.contract.attachments = fileName + ":" + filePath;
        this.jointAttachments()
      } else {
        this.notify.error(res.msg);
      }
    }
  }


  deleteAttachment(item: any) {
    let dateleString = "," + item.fileName + ":" + item.fileUrl;
    let items = this.contract.attachments.replace(dateleString, '');
    if (this.contract.attachments == items) {
      dateleString = item.fileName + ":" + item.fileUrl + ",";
      items = this.contract.attachments.replace(dateleString, '');
      if (this.contract.attachments == items) {
        dateleString = item.fileName + ":" + item.fileUrl;
        items = this.contract.attachments.replace(dateleString, '');
        this.contract.attachments = items;
        this.jointAttachments();
      } else {
        this.contract.attachments = items;
        this.jointAttachments();
      }
    } else {
      this.contract.attachments = items;
      this.jointAttachments();
    }

  }
}

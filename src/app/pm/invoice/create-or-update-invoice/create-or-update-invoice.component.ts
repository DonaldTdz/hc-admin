import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Invoice } from 'entities'
import { InvoiceService, ProjectService, PurchaseService } from 'services'
import { UploadFile } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-or-update-invoice',
  templateUrl: './create-or-update-invoice.component.html',
  styles: []
})
export class CreateOrUpdateInvoiceComponent extends ModalComponentBase implements OnInit {
  @Input() id: number;
  @Input() refId: string;
  @Input() type: number;
  refIdDisabled = false;
  title: string;
  form: FormGroup;
  refList: any;
  // purchaseList: any;
  // projectList: any;
  uploadDisabled = false;
  attachments = [];
  invoiceType = [{ text: '销项', value: 1 }, { text: '进项', value: 2 }];
  postUrl: string = '/File/DocFilesPostsAsync';
  uploadLoading = false;
  invoice: Invoice = new Invoice();
  constructor(injector: Injector, private invoiceService: InvoiceService, private fb: FormBuilder, private projectService: ProjectService
    , private purchaseService: PurchaseService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      type: [null, Validators.compose([Validators.required])],
      title: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      refId: [null],
      code: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      amount: [null, Validators.compose([Validators.maxLength(18)])],
      submitDate: [null]
    });
    if (this.id) {
      this.getData();
      this.title = "编辑发票";
    } else {
      this.title = "新增发票";
      this.invoice.amount = 0;
    }
    if (this.type) {
      this.invoice.type = this.type;
    }

    if (this.refId) {
      this.invoice.refId = this.refId;
      this.refIdDisabled = true;
    }
  }

  //编辑获取数据
  getData() {
    this.invoiceService.getById(this.id.toString()).subscribe((result) => {
      this.invoice = result;
      this.jointAttachments();
      // this.getRefList();
    });
  }

  getTitleByTypeAndRefId() {
    if (this.invoice.type && this.invoice.refId) {
      let params: any = {};
      params.Type = this.invoice.type;
      params.refId = this.invoice.refId;
      this.invoiceService.getTitleByTypeAndRefId(params).subscribe((result) => {
        this.invoice.title = result;
      });
    }
  }

  getRefList() {
    if (this.invoice.type == 1)
      this.getProjectList();
    else
      this.getPurchaseList();
  }

  //获取项目下拉列表
  getProjectList() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.refList = result;
    });
  }

  //获取采购下拉列表
  getPurchaseList() {
    this.purchaseService.getDropDownDtos().subscribe((result) => {
      this.refList = result;
    });
  }

  save() {
    this.invoiceService.createOrUpdate(this.invoice).finally(() => {
      this.saving = false;
    }).subscribe(() => {
      this.notify.success('保存成功！');
      this.success();
    });
  }

  //处理附件
  jointAttachments() {
    if (this.invoice.attachments) {
      let items = this.invoice.attachments.split(",");
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
        if (this.invoice.attachments)
          this.invoice.attachments = this.invoice.attachments + "," + fileName + ":" + filePath;
        else
          this.invoice.attachments = fileName + ":" + filePath;
        this.jointAttachments()
      } else {
        this.notify.error(res.msg);
      }
    }
  }


  deleteAttachment(item: any) {
    let dateleString = "," + item.fileName + ":" + item.fileUrl;
    let items = this.invoice.attachments.replace(dateleString, '');
    if (this.invoice.attachments == items) {
      dateleString = item.fileName + ":" + item.fileUrl + ",";
      items = this.invoice.attachments.replace(dateleString, '');
      if (this.invoice.attachments == items) {
        dateleString = item.fileName + ":" + item.fileUrl;
        items = this.invoice.attachments.replace(dateleString, '');
        this.invoice.attachments = items;
        this.jointAttachments();
      } else {
        this.invoice.attachments = items;
        this.jointAttachments();
      }
    } else {
      this.invoice.attachments = items;
      this.jointAttachments();
    }

  }
}

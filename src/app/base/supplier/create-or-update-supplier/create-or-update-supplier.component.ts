import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier } from 'entities'
import { SupplierService } from 'services'
import { UploadFile } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-or-update-supplier',
  templateUrl: './create-or-update-supplier.component.html',
  styleUrls: ['./create-or-update-supplier.component.scss']
})
export class CreateOrUpdateSupplierComponent extends ModalComponentBase implements OnInit {
  @Input() id: number;
  title: string;
  attachments = [];
  form: FormGroup;
  postUrl: string = '/File/DocFilesPostsAsync';
  uploadLoading = false;
  uploadDisabled = false;
  supplier: Supplier = new Supplier();
  constructor(injector: Injector, private supplierService: SupplierService, private fb: FormBuilder) { super(injector); }

  ngOnInit() {
    let verifyTel = /^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$/
    let verifyPhone = /^1[3|4|5|7|8|9][0-9]\d{8}$/
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      zipCode: [null, Validators.compose([Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9 ]{3,12}$')])],
      tel: [null, Validators.compose([Validators.pattern(verifyTel)])],
      contact: [null, Validators.compose([Validators.maxLength(50)])],
      position: [null, Validators.compose([Validators.maxLength(25)])],
      phone: [null, Validators.compose([Validators.pattern(verifyPhone)])],
      address: [null, Validators.compose([Validators.maxLength(250)])],
      desc: [null, Validators.compose([Validators.maxLength(250)])],
      remark: [null, Validators.compose([Validators.maxLength(250)])],
    });
    if (this.id) {
      this.getData();
      this.title = "编辑供应商";
    } else {
      this.title = "新增供应商";
    }
  }

  getData() {
    this.supplierService.GetById(this.id.toString()).subscribe((result) => {
      this.supplier = result;
      this.jointAttachments()
    });
  }

  save() {
    this.supplier.type = 0;
    this.supplierService.createOrUpdate(this.supplier).finally(() => {
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


  jointAttachments() {
    if (this.supplier.attachments) {
      let items = this.supplier.attachments.split(",");
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
        if (this.supplier.attachments)
          this.supplier.attachments = this.supplier.attachments + "," + fileName + ":" + filePath;
        else
          this.supplier.attachments = fileName + ":" + filePath;
        this.jointAttachments()
      } else {
        this.notify.error(res.msg);
      }
    }
  }


  deleteAttachment(item: any) {
    let dateleString = "," + item.fileName + ":" + item.fileUrl;
    let items = this.supplier.attachments.replace(dateleString, '');
    if (this.supplier.attachments == items) {
      dateleString = item.fileName + ":" + item.fileUrl + ",";
      items = this.supplier.attachments.replace(dateleString, '');
      if (this.supplier.attachments == items) {
        dateleString = item.fileName + ":" + item.fileUrl;
        items = this.supplier.attachments.replace(dateleString, '');
        this.supplier.attachments = items;
        this.jointAttachments();
      } else {
        this.supplier.attachments = items;
        this.jointAttachments();
      }
    } else {
      this.supplier.attachments = items;
      this.jointAttachments();
    }
  }


}

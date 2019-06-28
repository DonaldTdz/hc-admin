import { Component, OnInit, Input, Injector } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { UploadFile } from 'ng-zorro-antd';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styles: []
})
export class FileComponent extends ModalComponentBase implements OnInit {
  @Input() attachment;
  attachments = [];
  postUrl: string = '/File/DocFilesPostsAsync';
  uploadDisabled: boolean = false;
  spanHidden: boolean = false;
  constructor(injector: Injector) { super(injector); }

  ngOnInit() {
    this.jointAttachments();
  }

  //处理附件
  jointAttachments() {
    if (this.attachment) {
      let items = this.attachment.split(",");
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
    if (this.attachments.length >= 6) {
      this.spanHidden = true;
      this.uploadDisabled = true;
    }
    else {
      this.spanHidden = false;
      this.uploadDisabled = false;
    }
  }

  beforeUpload = (): boolean => {
    if (this.uploadDisabled) {
      this.notify.info('正在上传中');
      return false;
    }
    this.uploadDisabled = true;
    return true;
  }

  handleChange = (info: { file: UploadFile }): void => {
    if (info.file.status === 'error') {
      this.notify.error('上传文件异常，请重试');
      this.uploadDisabled = false;
    }
    if (info.file.status === 'done') {
      this.uploadDisabled = false;
      var res = info.file.response.result;
      if (res.code == 0) {
        this.notify.success('上传文件成功');
        let fileName = res.data.name;
        let filePath = res.data.url;
        if (this.attachment)
          this.attachment = this.attachment + "," + fileName + ":" + filePath;
        else
          this.attachment = fileName + ":" + filePath;
        this.jointAttachments()
      } else {
        this.notify.error(res.msg);
      }
    }
  }

  //删除附件
  deleteAttachment(item: any) {
    let dateleString = "," + item.fileName + ":" + item.fileUrl;
    let items = this.attachment.replace(dateleString, '');
    if (this.attachment == items) {
      dateleString = item.fileName + ":" + item.fileUrl + ",";
      items = this.attachment.replace(dateleString, '');
      if (this.attachment == items) {
        dateleString = item.fileName + ":" + item.fileUrl;
        items = this.attachment.replace(dateleString, '');
        this.attachment = items;
        this.jointAttachments();
      } else {
        this.attachment = items;
        this.jointAttachments();
      }
    } else {
      this.attachment = items;
      this.jointAttachments();
    }
  }

  save() {
    this.notify.success('保存成功！');
    this.success(this.attachment);
  }

}

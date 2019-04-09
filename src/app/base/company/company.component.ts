import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company, Account } from "entities";
import { ModalComponentBase } from '@shared/component-base';
import { CreateCompanyAccountComponent } from '@app/base/company/create-company-account/create-company-account.component'
import { CompanyService, CompanyAccountService } from 'services';
import { UploadFile } from 'ng-zorro-antd';
import {
  PagedListingComponentBase,
  PagedRequestDto,
  PagedResultDto
} from '@shared/component-base';
import { Key } from 'protractor';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styles: []
})
export class CompanyComponent
  extends PagedListingComponentBase<any>{
  // implements OnInit {

  constructor(injector: Injector,
    private companyService: CompanyService, private companyAccountService: CompanyAccountService,
    private fb: FormBuilder) {
    super(injector);
  }
  form: FormGroup;
  company: Company = new Company();
  request: PagedRequestDto;
  attachments = [];
  postUrl: string = '/File/DocFilesPostsAsync';
  uploadLoading = false;


  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    let verifyTel = /^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$/
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(25)])],
      bank: [null, Validators.compose([Validators.maxLength(25)])],
      bankAccount: [null, Validators.compose([Validators.maxLength(50), Validators.pattern('^[0-9]*$')])],
      dutyNo: [null, Validators.compose([Validators.maxLength(50)])],
      address: [null, Validators.compose([Validators.maxLength(250)])],
      tel: [null, Validators.compose([Validators.pattern(verifyTel)])],
      balance: [null, Validators.compose([Validators.maxLength(18)])],
    });

    // this.companyAccountService.getAll(this.request).finally(() => {
    //   finishedCallback();
    // })
    //   .subscribe((result: PagedResultDto) => {
    //     this.dataList = result.items;
    //     this.totalItems = result.totalCount;
    //   });

    this.fetchData()
  }

  getAccounts() {
    this.companyAccountService.getAll(this.request)
      .subscribe((result: PagedResultDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  fetchData(): void {
    this.companyService.getAll(this.request).subscribe((result) => {
      this.company = result.items.length > 0 ? result.items[0] : this.company;
      if (this.company.attachments)
        this.jointAttachments()
    });
  }

  jointAttachments() {
    let items = this.company.attachments.split(",");
    let arr = [];
    for (let item of items) {
      let fileName = item.split(":")[0];
      let fileUrl = item.split(":")[1];
      let map = { "fileName": fileName, "fileUrl": fileUrl };
      arr.push(map);
    }
    this.attachments = arr;
  }

  createCompanyAccount() {
    this.modalHelper.open(CreateCompanyAccountComponent, { initial: this.company.balance, companyId: this.company.id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getAccounts();
        this.fetchData();
      }
    });
  }

  save() {
    this.company.balance = this.company.balance ? this.company.balance : 0;
    this.companyService.createOrUpdate(this.company).subscribe(() => {
      this.notify.success('保存成功！');
      this.fetchData();
    })
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
        if (this.company.attachments)
          this.company.attachments = this.company.attachments + "," + fileName + ":" + filePath;
        else
          this.company.attachments = fileName + ":" + filePath;
        this.jointAttachments()
      } else {
        this.notify.error(res.msg);
      }
    }
  }
}

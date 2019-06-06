import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase, PagedResultDto } from '@shared/component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Invoice } from 'entities'
import { InvoiceService, ProjectService, PurchaseService, InvoiceDetailService } from 'services'
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CreateOrUpdateInvoicedetailComponent } from '../create-or-update-invoicedetail/create-or-update-invoicedetail.component'

@Component({
  selector: 'app-create-or-update-invoice',
  templateUrl: './create-or-update-invoice.component.html',
  styleUrls: ['./create-or-update-invoice.component.scss']
})
export class CreateOrUpdateInvoiceComponent extends AppComponentBase implements OnInit {
  id: string;
  projectId: any;
  purchaseId: any;
  refIdDisabled = false;
  title: string;
  loading = false;
  form: FormGroup;
  refList: any;
  uploadDisabled = false;
  invoiceDetails: any;
  attachments = [];
  invoiceType = [{ text: '销项', value: 1 }, { text: '进项', value: 2 }];
  postUrl: string = '/File/DocFilesPostsAsync';
  uploadLoading = false;
  invoice: Invoice = new Invoice();
  constructor(injector: Injector, private invoiceService: InvoiceService, private fb: FormBuilder, private projectService: ProjectService
    , private purchaseService: PurchaseService, private location: Location, private actRouter: ActivatedRoute
    , private invoiceDetailService: InvoiceDetailService, private nzMessage: NzMessageService) {
    super(injector); this.id = this.actRouter.snapshot.params['id'];
    this.projectId = this.actRouter.snapshot.params['projectId'];
    this.purchaseId = this.actRouter.snapshot.params['purchaseId'];
  }

  ngOnInit() {
    this.form = this.fb.group({
      type: [null, Validators.compose([Validators.required])],
      title: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      refId: [null, Validators.compose([Validators.required])],
      code: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      amount: [null, Validators.compose([Validators.maxLength(18)])],
      submitDate: [null]
    });
    if (this.purchaseId) {
      this.invoice.type = 2;
      this.invoice.refId = this.purchaseId;
    } else {
      this.invoice.type = 1;
      this.invoice.refId = this.projectId;
    }

    if (this.id) {
      this.invoice.id = this.id;
      this.getData();
      this.getInvoiceDetails();
      this.title = "发票详情";
    } else {
      this.title = "新增发票";
      this.invoice.amount = 0;
    }
    this.getTitleByTypeAndRefId();
    this.getRefList();
  }

  //编辑获取数据
  getData() {
    this.invoiceService.getById(this.id.toString()).subscribe((result) => {
      this.invoice = result;
      this.jointAttachments();
    });
  }

  getTitleByTypeAndRefId() {
    if (this.invoice.type && this.invoice.refId) {
      let params: any = {};
      params.Type = this.invoice.type;
      params.refId = this.invoice.refId;
      this.invoiceService.getTitleByTypeAndRefId(params).subscribe((result) => {
        if (result.value != null)
          this.invoice.title = result;
      });
    }
  }

  //查询发票明细
  getInvoiceDetails() {
    this.loading = true;
    let params: any = {};
    // params.SkipCount = (this.st.pi - 1) * this.st.ps;
    // params.MaxResultCount = this.st.ps;
    params.InvoiceId = this.invoice.id;
    params.Type = this.invoice.type;
    this.invoiceDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.invoiceDetails = result.items;
    })
  }

  //返回
  goBack(): void {
    this.location.back();
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

  //保存
  save() {
    this.invoiceService.createOrUpdate(this.invoice).finally(() => {
      this.saving = false;
    }).subscribe((data) => {
      this.invoice = data;
      this.id = this.invoice.id;
      this.notify.success('保存成功！');
    });
  }

  //编辑发票明细
  editDing(id: any) {
    this.modalHelper.open(CreateOrUpdateInvoicedetailComponent, { id: id, refId: this.invoice.refId, invoiceType: this.invoice.type }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getInvoiceDetails();
        this.getData();
      }
    });
  }

  //新增发票明细
  create() {
    if (!this.invoice.id) {
      return this.nzMessage.warning("请先保存发票")
    }
    this.modalHelper.open(CreateOrUpdateInvoicedetailComponent, { refId: this.invoice.refId, invoiceType: this.invoice.type, invoiceId: this.invoice.id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getInvoiceDetails();
        this.getData();
      }
    });
  }

  //删除
  delete(entity: Invoice) {
    this.message.confirm(
      "是否删除该发票明细?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.invoiceDetailService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getInvoiceDetails();
            this.getData();
          });
        }
      }
    )
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
    else
      this.uploadDisabled = false;
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

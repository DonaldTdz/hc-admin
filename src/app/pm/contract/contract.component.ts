import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { AppComponentBase, } from '@shared/app-component-base';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { ContractService, PaymentPlanService, ContractDetailService, InvoiceService, ImplementService, DataDictionaryService } from 'services'
import { Contract } from 'entities'
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ModifContractdetailComponent } from './modif-contractdetail/modif-contractdetail.component'
import { NzMessageService } from 'ng-zorro-antd';
import { FileComponent } from '../file/file.component';
import { CreateOrUpdateInvoicedetailComponent } from '../invoice/create-or-update-invoicedetail/create-or-update-invoicedetail.component'

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
  providers: [ContractDetailService, ImplementService]
})
export class ContractComponent extends AppComponentBase implements OnInit {
  loading = false;
  @Output() voted = new EventEmitter<boolean>();
  @Input() projectId;
  @Input() purchaseId;
  @Input() projectCode;
  @Input() projectName;
  @Input() projectStatus;
  incoiceEditIndex = -1;
  incoiceEditObj: any;
  implementEditIndex = -1;
  implementEditObj: any;
  editIndex = -1;
  editObj: any;
  projectTitle: string = '';
  // paymentPlanId: string = '';
  refIdDisabled = false;
  // incoiceId: string = '';
  form: FormGroup;
  contractDetails = [];
  readyEmployeeIds: any;
  refList: any;
  paymentPlanTotalAmount: number = 0;
  uploadDisabled = false;
  attachments = [];
  incoiceTotalAmount: number = 0;
  paymentPlanStatus = [{ text: '已回款', value: 1 }, { text: '未回款', value: 0 }];
  contractStatus = [{ text: '已完成', value: 1 }, { text: '未完成', value: 0 }];
  contractCodeType = [{ text: '软件', value: 2 }, { text: '硬件', value: 1 }];
  postUrl: string = '/File/DocFilesPostsAsync';
  uploadLoading = false;
  contract: Contract = new Contract();
  constructor(injector: Injector, private contractService: ContractService
    , private fb: FormBuilder, private paymentPlanService: PaymentPlanService
    , private nzMessage: NzMessageService, private invoiceService: InvoiceService
    , private implementService: ImplementService, private dataDictionaryService: DataDictionaryService
    , private contractDetailService: ContractDetailService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      signatureTime: [null],
      amount: [null, Validators.compose([Validators.maxLength(18), Validators.required])],
      contractDrafting: [null, Validators.compose([Validators.required])],
      originalRecycling: [null, Validators.compose([Validators.required])],
      paymentPlans: this.fb.array([]),
      attachments: [null],
      originalAnnex: [null],
      refId: [null],
      contractCode: [null],
      incoices: this.fb.array([]),
      implements: this.fb.array([]),
    });
    if (this.purchaseId) {
      this.contract.type = 2;
      this.contract.refId = this.purchaseId;
    } else {
      this.contract.type = 1;
      this.contract.refId = this.projectId;
    }
    if (this.contract.refId) {
      this.getpaymentPlans();
      this.getIncoices();
      this.getContract();
      this.getImplements();
    }
    if (this.projectCode && this.projectName)
      this.projectTitle = "项目编号：" + this.projectCode + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0项目名称：" + this.projectName;
    // this.getRefList();
  }

  //查询合同
  getContract() {
    let params: any = {};
    params.Type = this.contract.type;
    params.RefId = this.contract.refId;
    this.contractService.getById(null, this.contract.refId).subscribe((result: Contract) => {
      if (result.id) {
        this.contract = result;
        console.log(this.contract);
      } else {
        this.contract.contractDrafting = 0;
        this.contract.originalRecycling = 0;
      }
    })
  }

  //获取回款计划
  getpaymentPlans() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.projectId = this.projectId;
    this.paymentPlanService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      for (let item of result.items) {
        const field = this.paymentPlan();
        field.patchValue(item);
        this.paymentPlans.push(field);
        this.paymentPlanTotalAmount += item.amount;
      }
    });
  }

  //获取执行
  getImplements() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.projectId = this.projectId;
    this.implementService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      if (result.totalCount > 0) {
        for (let item of result.items) {
          const field = this.implement();
          field.patchValue(item);
          this.implements.push(field);
        }
      } else {
        this.addImplement();
      }
    });
  }

  //新增执行
  addImplement() {
    this.dataDictionaryService.getDropDownDtos("1").subscribe((result) => {
      for (let item of result) {
        let field = this.implement();
        field.patchValue({ "name": item.value, "isImplement": "false", "projectId": this.projectId, });
        this.implements.push(field);
      }
      console.log(this.implements);
    });
  }



  implement(): FormGroup {
    return this.fb.group({
      id: [null],
      projectId: [null],
      name: [null, [Validators.required]],
      isImplement: [null, [Validators.required]],
      attachments: [null],
      creationTime: [null],
      creatorUserId: [null],
    });
  }

  //获取发票
  getIncoices() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.refId = this.projectId;
    params.type = this.contract.type;
    this.invoiceService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      for (let item of result.items) {
        const field = this.incoice();
        field.patchValue(item);
        this.incoices.push(field);
        this.incoiceTotalAmount += item.amount;
      }
    });
  }

  get implements() {
    return this.form.controls.implements as FormArray;
  }

  //删除执行
  delIimplement(index: number, id: any) {
    // this.paymentPlanTotalAmount -= this.incoices.value[index].amount;
    this.implements.removeAt(index);
    if (id) {
      this.implementService.delete(id).subscribe(() => {
        this.notify.success('删除成功！');
      });
    }
  }

  //新增执行
  addIimplement() {
    this.implements.push(this.implement());
    this.editIimplement(this.incoices.length - 1);
  }

  //修改执行
  editIimplement(index: number) {
    if (this.implementEditIndex !== -1 && this.implementEditObj) {
      this.implements.at(this.implementEditIndex).patchValue(this.implementEditObj);
    }
    this.implementEditObj = { ...this.implements.at(index).value };
    this.implementEditIndex = index;
    // this.paymentPlanTotalAmount -= this.incoices.value[index].amount;
  }

  //取消执行
  cancelIimplement(index: number, id: any) {
    if (!this.implements.at(index).value.id) {
      this.implements.removeAt(index);
    } else {
      this.delIimplement(index, id);
    }
    this.incoiceEditIndex = -1;
  }

  //保存执行
  async saveIimplement(index: number, modifyDetail: boolean) {
    this.incoices.at(index).markAsDirty();
    if (this.incoices.at(index).invalid) return;
    this.incoiceEditIndex = -1;
    if (!this.incoices.value[index].id && this.incoiceEditObj.id) {
      this.incoices.value[index].id = this.incoiceEditObj.id;
      this.incoices.value[index].creationTime = this.incoiceEditObj.creationTime;
      // this.incoices.value[index].creatorUserId = this.incoiceEditObj.creatorUserId;
      this.incoices.value[index].refId = this.incoiceEditObj.refId;
      this.incoices.value[index].type = this.incoiceEditObj.type;
      this.incoices.value[index].amount = this.incoiceEditObj.amount;
    }
    // this.paymentPlanTotalAmount += this.incoices.value[index].amount;
    if (!this.incoices.value[index].id) {
      delete (this.incoices.value[index].creationTime);
      delete (this.incoices.value[index].creatorUserId);
      this.incoices.value[index].refId = this.contract.refId;
      this.incoices.value[index].type = this.contract.type;
      this.incoices.value[index].amount = 0;
    }
    await this.invoiceService.createOrUpdate(this.incoices.value[index])
      .subscribe((result: any) => {
        // this.notify.success("保存成功");
        this.incoices.value[index].id = result.id;
        this.incoices.value[index].creationTime = result.creationTime;
        this.incoices.value[index].creatorUserId = result.creatorUserId;
        console.log(this.incoices.value[index]);
        if (modifyDetail == true) {
          console.log(result.id);
          this.modalHelper.open(CreateOrUpdateInvoicedetailComponent, { "invoiceId": result.id }, 'xl', {
            nzMask: true, nzMaskClosable: false
          }).subscribe(invoiceAmount => {
            this.incoices.value[index].amount = invoiceAmount;
            this.incoiceTotalAmount += invoiceAmount;
            this.notify.success("保存成功");
          });
        } else {
          this.notify.success("保存成功");
        }
      });
  }

  paymentPlan(): FormGroup {
    return this.fb.group({
      id: [null],
      projectId: [null],
      planTime: [null, [Validators.required]],
      ratio: [null, [Validators.required]],
      paymentCondition: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      status: [null, [Validators.required]],
      statusName: [null],
      creationTime: [null],
      creatorUserId: [null],
    });
  }

  incoice(): FormGroup {
    return this.fb.group({
      id: [null],
      refId: [null],
      type: [null],
      code: [null, [Validators.required]],
      amount: [null],
      submitDate: [null, [Validators.required]],
      creationTime: [null],
      creatorUserId: [null],
    });
  }

  get paymentPlans() {
    return this.form.controls.paymentPlans as FormArray;
  }

  get incoices() {
    return this.form.controls.incoices as FormArray;
  }

  //删除发票
  delIncoice(index: number, id: any) {
    // this.paymentPlanTotalAmount -= this.incoices.value[index].amount;
    this.incoices.removeAt(index);
    this.incoiceTotalAmount -= this.incoices.value[index].amount;
    this.invoiceService.delete(id).subscribe(() => {
      this.notify.success('删除成功！');
    });
  }

  //新增发票
  addIncoice() {
    this.incoices.push(this.incoice());
    this.editIncoice(this.incoices.length - 1);
    // delete (this.incoices.value[this.incoices.length - 1]["creationTime"]);
  }

  //修改发票
  editIncoice(index: number) {
    if (this.incoiceEditIndex !== -1 && this.incoiceEditObj) {
      this.incoices.at(this.incoiceEditIndex).patchValue(this.incoiceEditObj);
    }
    this.incoiceEditObj = { ...this.incoices.at(index).value };
    this.incoiceEditIndex = index;
    // this.paymentPlanTotalAmount -= this.incoices.value[index].amount;
  }

  //取消发票
  cancelIncoice(index: number, id: any) {
    if (!this.incoices.at(index).value.id) {
      this.incoices.removeAt(index);
    } else {
      this.delIncoice(index, id);
    }
    this.incoiceEditIndex = -1;
  }

  //保存发票
  async saveIncoice(index: number, modifyDetail: boolean) {
    this.incoices.at(index).markAsDirty();
    if (this.incoices.at(index).invalid) return;
    this.incoiceEditIndex = -1;
    if (!this.incoices.value[index].id && this.incoiceEditObj.id) {
      this.incoices.value[index].id = this.incoiceEditObj.id;
      this.incoices.value[index].creationTime = this.incoiceEditObj.creationTime;
      // this.incoices.value[index].creatorUserId = this.incoiceEditObj.creatorUserId;
      this.incoices.value[index].refId = this.incoiceEditObj.refId;
      this.incoices.value[index].type = this.incoiceEditObj.type;
      this.incoices.value[index].amount = this.incoiceEditObj.amount;
    }
    // this.paymentPlanTotalAmount += this.incoices.value[index].amount;
    if (!this.incoices.value[index].id) {
      delete (this.incoices.value[index].creationTime);
      delete (this.incoices.value[index].creatorUserId);
      this.incoices.value[index].refId = this.contract.refId;
      this.incoices.value[index].type = this.contract.type;
      this.incoices.value[index].amount = 0;
    }
    await this.invoiceService.createOrUpdate(this.incoices.value[index])
      .subscribe((result: any) => {
        // this.notify.success("保存成功");
        this.incoices.value[index].id = result.id;
        this.incoices.value[index].creationTime = result.creationTime;
        this.incoices.value[index].creatorUserId = result.creatorUserId;
        console.log(this.incoices.value[index]);
        if (modifyDetail == true) {
          console.log(result.id);
          this.modalHelper.open(CreateOrUpdateInvoicedetailComponent, { "invoiceId": result.id }, 'xl', {
            nzMask: true, nzMaskClosable: false
          }).subscribe(invoiceAmount => {
            this.incoices.value[index].amount = invoiceAmount;
            this.incoiceTotalAmount += invoiceAmount;
            this.notify.success("保存成功");
          });
        } else {
          this.notify.success("保存成功");
        }
      });
  }

  //填写发票明细
  async modifyIncoiceDetail(index: number) {
    if (!this.incoices.value[index].id)
      await this.saveIncoice(index, true);
    else {
      await this.modalHelper.open(CreateOrUpdateInvoicedetailComponent, { "invoiceId": this.incoices.value[index].id }, 'xl', {
        nzMask: true, nzMaskClosable: false
      }).subscribe(invoiceAmount => {
        this.incoices.value[index].amount = invoiceAmount;
        this.incoiceTotalAmount += invoiceAmount;
        this.notify.success("保存成功");
      });
    }
  }


  //删除回款计划
  del(index: number, id: any) {
    this.paymentPlanTotalAmount -= this.paymentPlans.value[index].amount;
    this.paymentPlans.removeAt(index);
    this.paymentPlanService.delete(id).subscribe(() => {
      this.notify.success('删除成功！');
    });
  }

  //新增回款计划
  add() {
    this.paymentPlans.push(this.paymentPlan());
    this.edit(this.paymentPlans.length - 1);
  }

  //修改回款计划
  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.paymentPlans.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.paymentPlans.at(index).value };
    this.editIndex = index;
    if (this.paymentPlans.value[index].amount)
      this.paymentPlanTotalAmount -= this.paymentPlans.value[index].amount;
    // if (!this.paymentPlans.value[index].id)
  }

  //保存回款计划
  async saveProjectDetail(index: number) {
    this.paymentPlans.at(index).markAsDirty();
    if (this.paymentPlans.at(index).invalid) return;
    if (!this.paymentPlans.value[index].id && this.editObj.id) {
      this.paymentPlans.value[index].id = this.editObj.id;
      this.paymentPlans.value[index].creationTime = this.editObj.creationTime;
      this.paymentPlans.value[index].creatorUserId = this.editObj.creatorUserId;
    }
    if (!this.paymentPlans.value[index].id) {
      delete (this.paymentPlans.value[index].creationTime);
      delete (this.paymentPlans.value[index].creatorUserId);
    }
    this.editIndex = -1;
    this.paymentPlanTotalAmount += this.paymentPlans.value[index].amount;
    this.paymentPlans.value[index].projectId = this.projectId;
    await this.paymentPlanService.createOrUpdate(this.paymentPlans.value[index])
      .subscribe((result: any) => {
        this.notify.success("保存成功");
        this.paymentPlans.value[index].id = result.id;
        this.paymentPlans.value[index].creationTime = result.creationTime;
        this.paymentPlans.value[index].creatorUserId = result.creatorUserId;
      });
  }

  //取消成本计划
  cancel(index: number, id: any) {
    if (!this.paymentPlans.at(index).value.id) {
      this.paymentPlans.removeAt(index);
    } else {
      this.del(index, id);
    }
    this.editIndex = -1;
  }

  //填写合同明细
  modifyContractDetail() {
    this.modalHelper.open(ModifContractdetailComponent, { 'contractId': this.contract.id }, 'lg', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(isSave => {
      if (isSave) {
        this.contractDetails = isSave.contractDetails;
        this.contract.amount = isSave.contractAmount;
        console.log(this.contractDetails);
      }
    });
  }

  //上传合同原始文件
  uploadOriginal() {
    this.modalHelper.open(FileComponent, { 'attachment': this.contract.originalAnnex }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: any) => {
      if (result) {
        this.contract.originalAnnex = result
      }
    });
  }

  //上传合同文件
  uploadContract() {
    this.modalHelper.open(FileComponent, { 'attachment': this.contract.attachments }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: any) => {
      if (result) {
        this.contract.attachments = result
      }
    });
  }

  //上传执行文件
  uploadImplement(index: any) {
    this.modalHelper.open(FileComponent, { 'attachment': this.implements.value[index].attachments }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: any) => {
      if (result) {
        this.implements.value[index].attachments = result
      }
    });
  }

  save() {
    console.log(this.implements.value);
    if (this.contract.originalRecycling == 1 && !this.contract.originalAnnex)
      return this.nzMessage.warning("请上传原件");
    if (this.contract.contractDrafting == 1 && !this.contract.attachments)
      return this.nzMessage.warning("请上传合同")
    this.contractService.createOrUpdate(this.contract).finally(() => {
    }).subscribe((result: any) => {
      if (result.code == 1) {
        this.contract = result.data;
        this.contractDetailService.batchCreate(this.contractDetails, this.contract.id).subscribe(() => {
          this.notify.success(result.msg);
        });
        // this.vote(true);
      } else {
        this.notify.error(result.msg);
      }
    });
  }

  //刷新状态
  vote() {
    this.voted.emit(this.projectId);
  }

  //处理附件
  // jointAttachments() {
  //   if (this.contract.attachments) {
  //     let items = this.contract.attachments.split(",");
  //     let arr = [];
  //     for (let item of items) {
  //       let fileName = item.split(":")[0];
  //       let fileUrl = item.split(":")[1];
  //       let map = { "fileName": fileName, "fileUrl": fileUrl };
  //       arr.push(map);
  //     }
  //     this.attachments = arr;
  //   } else {
  //     this.attachments = []
  //   }
  //   if (this.attachments.length >= 6)
  //     this.uploadDisabled = true;
  //   else
  //     this.uploadDisabled = false;
  // }

  // beforeUpload = (): boolean => {
  //   if (this.uploadLoading) {
  //     this.notify.info('正在上传中');
  //     return false;
  //   }
  //   this.uploadLoading = true;
  //   return true;
  // }

  // handleChange = (info: { file: UploadFile }): void => {
  //   if (info.file.status === 'error') {
  //     this.notify.error('上传文件异常，请重试');
  //     this.uploadLoading = false;
  //   }
  //   if (info.file.status === 'done') {
  //     this.uploadLoading = false;
  //     var res = info.file.response.result;
  //     if (res.code == 0) {
  //       this.notify.success('上传文件成功');
  //       let fileName = res.data.name;
  //       let filePath = res.data.url;
  //       if (this.contract.attachments)
  //         this.contract.attachments = this.contract.attachments + "," + fileName + ":" + filePath;
  //       else
  //         this.contract.attachments = fileName + ":" + filePath;
  //       this.jointAttachments()
  //     } else {
  //       this.notify.error(res.msg);
  //     }
  //   }
  // }

  //删除附件
  // deleteAttachment(item: any) {
  //   let dateleString = "," + item.fileName + ":" + item.fileUrl;
  //   let items = this.contract.attachments.replace(dateleString, '');
  //   if (this.contract.attachments == items) {
  //     dateleString = item.fileName + ":" + item.fileUrl + ",";
  //     items = this.contract.attachments.replace(dateleString, '');
  //     if (this.contract.attachments == items) {
  //       dateleString = item.fileName + ":" + item.fileUrl;
  //       items = this.contract.attachments.replace(dateleString, '');
  //       this.contract.attachments = items;
  //       this.jointAttachments();
  //     } else {
  //       this.contract.attachments = items;
  //       this.jointAttachments();
  //     }
  //   } else {
  //     this.contract.attachments = items;
  //     this.jointAttachments();
  //   }
  // }


}

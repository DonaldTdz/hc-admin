import { Component, OnInit, Injector } from '@angular/core';
import { PurchaseService, PurchaseDetailService, InvoiceService, EmployeeServiceProxy, AdvancePaymentService } from 'services';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { PurchaseDetail, Purchase } from 'entities';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FileComponent } from '@app/pm/file/file.component';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CreateOrUpdatePurchasedetailComponent } from '../create-or-update-purchasedetail/create-or-update-purchasedetail.component';
import { CreateOrUpdateInvoicedetailComponent } from '../../invoice/create-or-update-invoicedetail/create-or-update-invoicedetail.component';
import { AdvancepaymentDetailComponent } from '../../advancepayment/advancepayment-detail/advancepayment-detail.component'
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-detail-purchase',
  templateUrl: './detail-purchase.component.html',
  styleUrls: ['./detail-purchase.component.scss'],
  providers: [AdvancePaymentService]
})
export class DetailPurchaseComponent extends AppComponentBase implements OnInit {
  id: any = '';
  incoiceLoading = false;
  loading = false;
  detailLoading = false;
  form: FormGroup;
  editIndex = -1;
  editObj: any;
  purchaseDetails = [];
  advancePaymentAmount: number = 0;
  // advancePaymentRatio: number = 0;
  purchaseDetailAmount: number = 0;
  totalProportion: number = 0;
  incoiceTotalAmount: number = 0;
  incoiceEditIndex = -1;
  incoiceEditObj: any;
  projectList: any;
  employeeList: any;
  pageSize = 200;
  pageIndex = 1;
  purchaseDetail: PurchaseDetail = new PurchaseDetail();
  purchase: Purchase = new Purchase();
  constructor(injector: Injector, private purchaseService: PurchaseService, private fb: FormBuilder
    , private purchaseDetailService: PurchaseDetailService, private advancePaymentService: AdvancePaymentService
    , private employeeServiceProxy: EmployeeServiceProxy, private actRouter: ActivatedRoute
    , private nzMessage: NzMessageService, private invoiceService: InvoiceService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.form = this.fb.group({
      code: [null, Validators.compose([Validators.required, Validators.maxLength(35)])],
      employeeId: [null, Validators.required],
      purchaseDate: [null],
      arrivalDate: [null],
      // invoiceIssuance: [null, Validators.required],
      desc: [null, Validators.compose([Validators.maxLength(250)])],
      advancePayments: this.fb.array([]),
      incoices: this.fb.array([]),
    });
    this.getEmployeeList();
    if (this.id) {
      this.getPurchaseDetail();
      this.getPurchase();
      this.getAdvancePayments();
      this.getIncoices();
    }
  }

  //获取采购
  getPurchase() {
    this.purchaseService.getById(this.id).subscribe((result) => {
      this.purchase = result;
    });
  }


  //获取采购明细
  getPurchaseDetail() {
    this.detailLoading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.PurchaseId = this.id;
    this.purchaseDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.detailLoading = false;
      let items = [];
      for (let item of result.items) {
        item.amount = item.num * (item.price * 100) / 100;
        item.taxAmount = item.amount * (parseFloat(item.taxRate.replace("%", "")) / 100);
        item.totalAmount = item.amount + item.taxAmount;
        this.purchaseDetailAmount += item.totalAmount;
        items.push(item);
      }
      this.query.data = items;
      this.query.total = result.totalCount;
    })
  }

  //创建采购明细
  createPurchaseDetail() {
    this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, { 'purchaseId': this.id }, 'lg', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(isSave => {
      if (isSave) {
        this.getPurchaseDetail();
      }
    });
  }

  //删除采购明细
  deleteDetail(id: string) {
    this.purchaseDetailService.DeleteAndUpdatePurchaseAsync(id).subscribe(() => {
      this.notify.success('删除成功！');
      this.getPurchaseDetail();
    });
  }

  //编辑采购明细
  editPurchaseDetail(id: string) {
    this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, { 'id': id }, 'lg', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(isSave => {
      if (isSave) {
        this.getPurchaseDetail();
      }
    });
  }


  //获取人员下拉列表
  getEmployeeList() {
    this.employeeServiceProxy.getDropDownDtos().subscribe((result) => {
      this.employeeList = result;
    });
  }

  //上传采购文件
  uploadPurchase() {
    this.modalHelper.open(FileComponent, { 'attachment': this.purchase.attachments }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: any) => {
      if (result) {
        if (result == "false")
          this.purchase.attachments = '';
        else
          this.purchase.attachments = result;
      }
    });
  }

  //获取付款计划
  getAdvancePayments() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.PurchaseId = this.id;
    this.advancePaymentService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.totalProportion = 0;
      while (this.advancePayments.length !== 0) {
        this.advancePayments.removeAt(0)
      }
      for (let item of result.items) {
        const field = this.advancePayment();
        field.patchValue(item);
        this.advancePayments.push(field);
        this.totalProportion += item.ratio;
      }
    });
  }

  advancePayment(): FormGroup {
    return this.fb.group({
      id: [null],
      planTime: [null, [Validators.required]],
      ratio: [null, [Validators.required]],
      desc: [null],
      amount: [null],
      status: [null, [Validators.required]],
      paymentTime: [null, [Validators.required]],
      creationTime: [null],
      purchaseId: [null]
    });
  }

  get advancePayments() {
    return this.form.controls.advancePayments as FormArray;
  }

  //删除付款计划
  del(index: number) {
    this.advancePaymentService.delete(this.advancePayments.value[index].id).subscribe(() => {
      this.notify.success('删除成功！');
      this.advancePayments.removeAt(index);
    });
  }

  //新增付款计划
  add() {
    this.advancePaymentAmount = 0;
    this.advancePayments.push(this.advancePayment());
    this.edit(this.advancePayments.length - 1);
  }

  //修改付款计划
  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.advancePayments.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.advancePayments.at(index).value };
    this.advancePaymentAmount = this.editObj.amount;
    this.editIndex = index;
  }

  //保存付款计划
  async saveAdvancePayment(index: number, modifyDetail: boolean) {
    if (this.advancePayments.value[index].id)
      this.totalProportion -= this.advancePayments.value[index].ratio;
    this.totalProportion += this.advancePayments.value[index].ratio;
    if (this.totalProportion > 100) {
      this.totalProportion -= this.advancePayments.value[index].ratio;
      return this.nzMessage.error("付款比例不能超过100%");
    }
    this.advancePayments.at(index).markAsDirty();
    if (this.advancePayments.at(index).invalid) return;
    if (!this.advancePayments.value[index].id && this.editObj.id) {
      this.advancePayments.value[index].id = this.editObj.id;
      this.advancePayments.value[index].creationTime = this.editObj.creationTime;
    }
    if (!this.advancePayments.value[index].id) {
      delete (this.advancePayments.value[index].creationTime);
    }
    this.editIndex = -1;
    this.advancePayments.value[index].purchaseId = this.id;
    await this.advancePaymentService.createOrUpdate(this.advancePayments.value[index])
      .subscribe((result: any) => {
        this.getAdvancePayments();
        if (modifyDetail == true) {
          this.editIndex = index;
          this.modalHelper.open(AdvancepaymentDetailComponent, { "advancePaymentId": result.id, 'purchaseId': this.purchase.id }, 'xl', {
            nzMask: true, nzMaskClosable: false
          }).subscribe(advancePaymentAmount => {
            if (!advancePaymentAmount)
              advancePaymentAmount = 0;
            this.advancePayments.value[index].amount = advancePaymentAmount;
            // this.advancePaymentRatio = advancePaymentAmount / this.purchaseDetailAmount * 100;
            this.advancePaymentAmount = advancePaymentAmount;
            this.notify.success("保存成功");
          });
        } else {
          this.notify.success("保存成功");
        }
      });
  }

  //填写付款计划明细
  async modifyAdvancePaymentDetail(index: number) {
    if (!this.editObj.id)
      await this.saveAdvancePayment(index, true);
    else {
      await this.modalHelper.open(AdvancepaymentDetailComponent, { "advancePaymentId": this.editObj.id, 'purchaseId': this.purchase.id }, 'xl', {
        nzMask: true, nzMaskClosable: false
      }).subscribe(advancePaymentAmount => {
        if (!advancePaymentAmount)
          advancePaymentAmount = 0;
        this.advancePayments.value[index].amount = advancePaymentAmount;
        this.editObj.amount = advancePaymentAmount;
        // this.advancePaymentRatio = (advancePaymentAmount / this.purchaseDetailAmount * 100).valueOf;
        this.advancePaymentAmount = advancePaymentAmount;
        this.notify.success("保存成功");
      });
    }
  }

  //取消付款计划
  cancel(index: number) {
    if (!this.advancePayments.at(index).value.id) {
      this.advancePayments.removeAt(index);
    } else {
      this.del(index);
    }
    this.editIndex = -1;
  }
  //发票
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

  get incoices() {
    return this.form.controls.incoices as FormArray;
  }

  //获取发票
  getIncoices() {
    this.incoiceLoading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.refId = this.id;
    params.type = 2;
    this.invoiceService.getAll(params).subscribe((result: PagedResultDto) => {
      while (this.incoices.length !== 0) {
        this.incoices.removeAt(0)
      }
      this.incoiceLoading = false;
      for (let item of result.items) {
        const field = this.incoice();
        field.patchValue(item);
        this.incoices.push(field);
        this.incoiceTotalAmount += item.amount;
      }
    });
  }

  //删除发票
  delIncoice(index: number, id: any) {
    this.incoiceTotalAmount -= this.incoices.value[index].amount;
    this.incoices.removeAt(index);
    this.invoiceService.delete(id).subscribe(() => {
      this.notify.success('删除成功！');
    });
  }

  //新增发票
  addIncoice() {
    this.incoices.push(this.incoice());
    this.editIncoice(this.incoices.length - 1);
  }

  //修改发票
  editIncoice(index: number) {
    if (this.incoiceEditIndex !== -1 && this.incoiceEditObj) {
      this.incoices.at(this.incoiceEditIndex).patchValue(this.incoiceEditObj);
    }
    this.incoiceEditObj = { ...this.incoices.at(index).value };
    this.incoiceEditIndex = index;
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
  saveIncoice(index: number, modifyDetail: boolean) {
    this.incoices.at(index).markAsDirty();
    if (this.incoices.at(index).invalid) return;
    this.incoiceEditIndex = -1;
    if (!this.incoices.value[index].id && this.incoiceEditObj.id) {
      this.incoices.value[index].id = this.incoiceEditObj.id;
      this.incoices.value[index].creationTime = this.incoiceEditObj.creationTime;
      this.incoices.value[index].creatorUserId = this.incoiceEditObj.creatorUserId;
      this.incoices.value[index].refId = this.incoiceEditObj.refId;
      this.incoices.value[index].type = this.incoiceEditObj.type;
      this.incoices.value[index].amount = this.incoiceEditObj.amount;
    }
    if (!this.incoices.value[index].id) {
      delete (this.incoices.value[index].creationTime);
      delete (this.incoices.value[index].creatorUserId);
      this.incoices.value[index].refId = this.purchase.id;
      this.incoices.value[index].type = 2;
      this.incoices.value[index].amount = 0;
    }
    this.invoiceService.createOrUpdate(this.incoices.value[index])
      .subscribe((result: any) => {
        if (modifyDetail == true) {
          this.modalHelper.open(CreateOrUpdateInvoicedetailComponent, { "invoiceId": result.id, 'purchaseId': this.purchase.id, 'type': result.type }, 'xl', {
            nzMask: true, nzMaskClosable: false
          }).subscribe(invoiceAmount => {
            if (!invoiceAmount)
              invoiceAmount = 0;
            this.incoices.value[index].amount = invoiceAmount;
            this.incoiceTotalAmount += invoiceAmount;
            this.notify.success("保存成功");
          });
        } else {
          this.getIncoices();
          this.notify.success("保存成功");
        }
      });
  }

  //填写发票明细
  async modifyIncoiceDetail(index: number) {
    if (!this.incoiceEditObj.id)
      await this.saveIncoice(index, true);
    else {
      this.incoiceTotalAmount -= this.incoiceEditObj.amount;
      await this.modalHelper.open(CreateOrUpdateInvoicedetailComponent, { "invoiceId": this.incoiceEditObj.id, 'purchaseId': this.purchase.id, 'type': this.incoiceEditObj.type }, 'xl', {
        nzMask: true, nzMaskClosable: false
      }).subscribe(invoiceAmount => {
        if (!invoiceAmount)
          invoiceAmount = 0;
        this.incoices.value[index].amount = invoiceAmount;
        this.incoiceEditObj.amount = invoiceAmount
        this.incoiceTotalAmount += invoiceAmount;
        this.notify.success("保存成功");
      });
    }
  }

  //返回
  return() {
    history.back();
  }

  //保存
  save() {
    this.purchaseService.createOrUpdate(this.purchase).finally(() => {
    }).subscribe((result: any) => {
      this.notify.success("保存成功");
    });
  }

}

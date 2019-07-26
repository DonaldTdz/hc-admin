import { Component, OnInit, Injector } from '@angular/core';
import { PurchaseService, PurchaseDetailService, EmployeeServiceProxy, AdvancePaymentService } from 'services';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { PurchaseDetail, Purchase } from 'entities';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FileComponent } from '@app/pm/file/file.component';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CreateOrUpdatePurchasedetailComponent } from '../create-or-update-purchasedetail/create-or-update-purchasedetail.component'

@Component({
  selector: 'app-detail-purchase',
  templateUrl: './detail-purchase.component.html',
  styleUrls: ['./detail-purchase.component.scss'],
  providers: [AdvancePaymentService]
})
export class DetailPurchaseComponent extends AppComponentBase implements OnInit {
  id: any = '';
  loading = false;
  detailLoading = false;
  form: FormGroup;
  editIndex = -1;
  editObj: any;
  purchaseDetails = [];
  advancePaymentRatio: number = 0;
  purchaseDetailAmount: number = 0;
  projectList: any;
  employeeList: any;
  pageSize = 200;
  pageIndex = 1;
  purchaseDetail: PurchaseDetail = new PurchaseDetail();
  purchase: Purchase = new Purchase();
  constructor(injector: Injector, private purchaseService: PurchaseService, private fb: FormBuilder
    , private purchaseDetailService: PurchaseDetailService, private advancePaymentService: AdvancePaymentService
    , private employeeServiceProxy: EmployeeServiceProxy, private actRouter: ActivatedRoute) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.form = this.fb.group({
      code: [null, Validators.compose([Validators.required, Validators.maxLength(35)])],
      employeeId: [null, Validators.required],
      purchaseDate: [null],
      arrivalDate: [null],
      invoiceIssuance: [null, Validators.required],
      desc: [null, Validators.compose([Validators.maxLength(250)])],
      advancePayments: this.fb.array([]),
    });
    this.getEmployeeList();
    if (this.id) {
      this.getPurchaseDetail();
      this.getPurchase();
      this.getAdvancePayments();
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
      for (let item of result.items) {
        const field = this.advancePayment();
        field.patchValue(item);
        this.advancePayments.push(field);
      }
    });
  }

  advancePayment(): FormGroup {
    return this.fb.group({
      id: [null],
      planTime: [null, [Validators.required]],
      ratio: [null, [Validators.required]],
      desc: [null],
      amount: [null, [Validators.required]],
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
    this.advancePayments.removeAt(index);
  }

  //新增付款计划
  add() {
    this.advancePayments.push(this.advancePayment());
    this.edit(this.advancePayments.length - 1);
  }

  //修改付款计划
  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.advancePayments.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.advancePayments.at(index).value };
    this.editIndex = index;
  }

  //保存付款计划
  async saveAdvancePayment(index: number) {
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
    console.log(this.advancePayments);
    this.advancePayments.value[index].purchaseId = this.id;
    await this.advancePaymentService.createOrUpdate(this.advancePayments.value[index])
      .subscribe((result: any) => {
        this.notify.success("保存成功");
        this.advancePayments.value[index].id = result.id;
        this.advancePayments.value[index].creationTime = result.creationTime;
        this.advancePayments.value[index].creatorUserId = result.creatorUserId;
      });
  }

  //取消付款计划
  cancel(index: number) {
    this.advancePayments.removeAt(index);
    this.editIndex = -1;
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
      this.return();
    });
  }

}

import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Purchase, PurchaseDetail } from 'entities'
import { PurchaseService, ProjectService, EmployeeServiceProxy, } from 'services'
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { FileComponent } from '../../file/file.component';
import { CreateOrUpdatePurchasedetailComponent } from '../create-or-update-purchasedetail/create-or-update-purchasedetail.component'

@Component({
  selector: 'app-create-purchase',
  templateUrl: './create-purchase.component.html',
  styleUrls: ['./create-purchase.component.scss']
})
export class CreatePurchaseComponent extends AppComponentBase implements OnInit {
  loading = 'false';
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
    , private projectService: ProjectService
    , private employeeServiceProxy: EmployeeServiceProxy, private actRouter: ActivatedRoute) {
    super(injector);
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
    this.getPurchaseCode();
  }

  //获取自动生成的采购编号
  getPurchaseCode() {
    this.purchaseService.getPurchaseCode().subscribe((resule) => {
      this.purchase.code = resule;
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

  //创建采购明细
  createPurchaseDetail() {
    this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, {}, 'lg', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: PurchaseDetail) => {
      if (result) {
        const obj = this.PurchaseDetailturnObj(result)
        this.purchaseDetails.push(obj);
      }
    });
  }

  PurchaseDetailturnObj(req: PurchaseDetail) {
    let obj: any = {};
    obj.purchaseId = '';
    if (req.purchaseId)
      obj.purchaseId = req.purchaseId
    obj.supplierId = req.supplierId;
    obj.supplierName = req.supplierName;
    obj.productId = '';
    if (req.productId)
      obj.productId = req.productId
    obj.num = req.num;
    obj.price = req.price;
    obj.name = req.name;
    obj.taxRate = req.taxRate;
    obj.specification = req.specification;
    obj.amount = obj.num * (obj.price * 100) / 100;
    obj.taxAmount = obj.amount * (parseFloat(obj.taxRate.replace("%", "")) / 100);
    obj.totalAmount = obj.amount + obj.taxAmount;
    this.purchaseDetailAmount += obj.totalAmount;
    return obj
  }

  //删除采购明细
  deleteDetail(item: any, index: number) {
    this.purchaseDetailAmount -= item.totalAmount;
    this.purchaseDetails.splice(index, 1)
  }

  //编辑采购明细
  editPurchaseDetail(item: any, index: number) {
    this.purchaseDetailAmount -= item.totalAmount;
    this.purchaseDetail = item;
    this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, { 'purchaseDetail': this.purchaseDetail }, 'lg', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: PurchaseDetail) => {
      if (result) {
        const obj = this.PurchaseDetailturnObj(result);
        this.purchaseDetails[index] = obj;
      }
    });
  }

  //获取人员下拉列表
  getEmployeeList() {
    this.employeeServiceProxy.getDropDownDtos().subscribe((result) => {
      this.employeeList = result;
    });
  }
  //保存
  save() {
    this.purchaseService.OnekeyCreateAsync(this.purchase, this.purchaseDetails, this.advancePayments.value).finally(() => {
    }).subscribe((result: any) => {
      this.notify.success("保存成功");
      this.goBack();
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
    this.editIndex = -1;
    console.log(this.advancePayments);
    // await this.paymentPlanService.createOrUpdate(this.paymentPlans.value[index])
    //   .subscribe((result: any) => {
    //     this.notify.success("保存成功");
    //     this.paymentPlans.value[index].id = result.id;
    //     this.paymentPlans.value[index].creationTime = result.creationTime;
    //     this.paymentPlans.value[index].creatorUserId = result.creatorUserId;
    //   });
  }

  //取消付款计划
  cancel(index: number) {
    this.advancePayments.removeAt(index);
    this.editIndex = -1;
  }

  goBack(): void {
    history.back();
  }

}

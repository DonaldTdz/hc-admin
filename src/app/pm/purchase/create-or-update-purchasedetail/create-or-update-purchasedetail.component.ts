import { Component, OnInit, Injector, Input } from '@angular/core';
import { PurchaseDetail } from 'entities'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataDictionaryService, SupplierService, PurchaseDetailService } from 'services'
import { ModalComponentBase } from '@shared/component-base';
import { SelectionProductComponent } from '@app/base/product/selection-product/selection-product.component'

@Component({
  selector: 'app-create-or-update-purchasedetail',
  templateUrl: './create-or-update-purchasedetail.component.html',
  styleUrls: ['./create-or-update-purchasedetail.component.scss'],
  providers: [PurchaseDetailService, SupplierService]
})
export class CreateOrUpdatePurchasedetailComponent extends ModalComponentBase implements OnInit {
  form: FormGroup;
  @Input() id: any;
  @Input() purchaseId: any;
  @Input() purchaseDetail: PurchaseDetail = new PurchaseDetail();
  isInput = false;
  taxAmount: number = 0;
  totalAmount: number = 0;
  amount: number = 0;
  supplierId: string;
  taxRates = [];
  supplierList: any;
  projectDetailList: any;
  constructor(injector: Injector, private dataDictionaryService: DataDictionaryService, private supplierService: SupplierService
    , private fb: FormBuilder, private purchaseDetailService: PurchaseDetailService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      supplierId: [null, Validators.compose([Validators.required])],
      purchaseId: [null],
      productId: [null],
      num: [null, Validators.compose([Validators.required])],
      price: [null, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      specification: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      taxRate: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      amount: [null],
      totalAmount: [null],
      taxAmount: [null],
    });
    this.getSupplierList();
    this.getTaxRates();
    if (this.id || this.purchaseDetail.supplierId) {
      if (this.id)
        this.getData();
      this.title = "编辑采购明细";
      // this.supplierId = this.purchaseDetail.supplierId.toString();
    } else {
      this.title = "新增采购明细";
      this.purchaseDetail.price = 0;
      this.purchaseDetail.num = 0;
    }
  }

  getSupplierList() {
    this.supplierService.getDropDownDtos().subscribe((result) => {
      this.supplierList = result;
    })
  }

  getData() {
    this.purchaseDetailService.getById(this.id).subscribe((result) => {
      this.purchaseDetail = result;
      this.supplierId = this.purchaseDetail.supplierId.toString();
    });
  }

  taxRateSelect() {
    if (this.purchaseDetail.taxRate) {
      this.amount = this.purchaseDetail.num * (this.purchaseDetail.price * 100) / 100;
      this.taxAmount = this.amount * (parseFloat(this.purchaseDetail.taxRate.replace("%", "")) / 100);
      this.totalAmount = this.amount + this.taxAmount;
    }
  }

  supplierSelect(value: any) {
    if (value) {
      for (let item of this.supplierList) {
        if (item.value == value) {
          this.purchaseDetail.supplierName = item.text;
          return;
        }
      }
    }
  }

  //获取税率
  getTaxRates() {
    this.dataDictionaryService.getDropDownDtos("8").subscribe((result) => {
      this.taxRates = result;
    });
  }

  //选择已有产品
  productSelection() {
    this.modalHelper.open(SelectionProductComponent, {}, 'md', {
      nzMask: true
    }).subscribe(result => {
      if (result) {
        this.purchaseDetail.productId = result.id;
        this.purchaseDetail.name = result.name;
        this.purchaseDetail.specification = result.specification;
        this.purchaseDetail.price = result.price;
        this.purchaseDetail.taxRate = result.taxRate;
        this.isInput = true;
        this.taxRateSelect();
      }
    });
  }

  save() {
    // this.purchaseDetail.supplierId = parseInt(this.supplierId);
    // if (!this.id && !this.purchaseId) {
    //   for (let supplier of this.supplierList) {
    //     if (supplier.value == this.purchaseDetail.supplierId)
    //       this.purchaseDetail.supplierName = supplier.text;
    //   }
    //   for (let projectDetail of this.projectDetailList) {
    //     // if (projectDetail.value == this.purchaseDetail.projectDetailId)
    //     //   this.purchaseDetail.projectDetailName = projectDetail.text;
    //   }
    //   // this.purchaseDetail.projectDetailName
    //   this.notify.success('保存成功！');
    //   this.success(this.purchaseDetail);
    // }
    // else {
    //   this.purchaseDetailService.createOrUpdate(this.purchaseDetail).finally(() => {
    //     this.saving = false;
    //   }).subscribe(() => {
    //     this.notify.success('保存成功！');
    //     this.success();
    //   });
    // }
    if (this.id) {
      if (this.id) {

      }

    } else {
      if (this.purchaseId) {

      } else {
        this.notify.success('保存成功！');
        this.success(this.purchaseDetail);
      }
    }
  }

}

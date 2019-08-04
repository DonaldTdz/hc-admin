import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { InvoiceDetailService, PurchaseDetailService, DataDictionaryService, ContractDetailService } from 'services'
import { ModalComponentBase, PagedResultDto } from '@shared/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-or-update-invoicedetail',
  templateUrl: './create-or-update-invoicedetail.component.html',
  providers: [ContractDetailService]
})
export class CreateOrUpdateInvoicedetailComponent extends ModalComponentBase implements OnInit {
  form: FormGroup;
  @Input() invoiceId: number;
  @Input() purchaseId: string;
  @Input() contractId: string;
  @Input() type: number;
  refDetails = [];
  editIndex = -1;
  loading: boolean = false;
  invoiceAmount: number = 0;
  editObj = {};
  taxRates: any;
  title: string;
  // totalAmount: number = 0;
  constructor(injector: Injector, private invoiceDetailService: InvoiceDetailService
    , private fb: FormBuilder, private dataDictionaryService: DataDictionaryService
    , private purchaseDetailService: PurchaseDetailService, private nzMessage: NzMessageService
    , private contractDetailService: ContractDetailService
  ) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      invoiceDetails: this.fb.array([]),
    });
    console.log(this.invoiceId + "fsd");
    this.title = "编辑发票明细";
    if (this.invoiceId) {
      this.getInvoiceDetails();
      this.getTaxRates();
    }
    if (this.purchaseId)
      this.getPurchaseDetailSelect();
    else
      this.getContractDetailSelect();
  }

  //获取采购明细下拉列表
  getPurchaseDetailSelect() {
    this.purchaseDetailService.getDropDownsByPurchaseId(this.purchaseId).subscribe((result: any) => {
      this.refDetails = result;
    })
  }

  //获取合同明细下拉列表
  getContractDetailSelect() {
    this.contractDetailService.getDropDownsByContractId(this.contractId).subscribe((result: any) => {
      this.refDetails = result;
    })
  }

  //获取发票明细
  getInvoiceDetails() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = 0;
    params.MaxResultCount = 10;
    params.invoiceId = this.invoiceId;
    this.invoiceDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      for (let item of result.items) {
        const field = this.invoiceDetail();
        field.patchValue(item);
        this.invoiceDetails.push(field);
        this.invoiceAmount += item.totalAmount;
      }
    });
  }

  getTaxRates() {
    this.dataDictionaryService.getDropDownDtos("5").subscribe((result: any) => {
      this.taxRates = result;
    })
  }

  invoiceDetail(): FormGroup {
    return this.fb.group({
      id: [null],
      invoiceId: [null],
      refId: [null],
      name: [null, [Validators.maxLength(120)]],
      specification: [null, [Validators.maxLength(100)]],
      unit: [null, Validators.maxLength(25)],
      price: [null, [Validators.required, Validators.maxLength(18)]],
      num: [null, [Validators.required, Validators.maxLength(18)]],
      amount: [null],
      taxRate: [null, [Validators.required]],
      taxAmount: [null],
      totalAmount: [null]
    });
  }

  get invoiceDetails() {
    return this.form.controls.invoiceDetails as FormArray;
  }

  //新增
  add() {
    this.invoiceDetails.push(this.invoiceDetail());
    this.edit(this.invoiceDetails.length - 1);
  }

  //修改
  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.invoiceDetails.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.invoiceDetails.at(index).value };
    this.editIndex = index;
    this.invoiceAmount -= this.invoiceDetails.value[index].totalAmount;
  }

  //保存
  save(index: number) {
    if (this.purchaseId || this.contractId) {
      for (let item of this.refDetails) {
        if (item.value == this.invoiceDetails.value[index].refId) {
          let arr = item.text.split("(");
          this.invoiceDetails.value[index].name = arr[0];
          this.invoiceDetails.value[index].specification = arr[1].split(")")[0];
          break;
        }
      }
    }
    if (!this.invoiceDetails.value[index].name)
      return this.nzMessage.warning("请输入名称")
    if (!this.invoiceDetails.value[index].specification)
      return this.nzMessage.warning("请输入规格型号")
    this.invoiceDetails.at(index).markAsDirty();
    if (this.invoiceDetails.at(index).invalid) return;
    this.editIndex = -1;
    this.invoiceDetails.value[index].amount = parseFloat(this.invoiceDetails.value[index].num) * this.invoiceDetails.value[index].price;
    this.invoiceDetails.value[index].taxAmount = this.invoiceDetails.value[index].amount * (parseFloat(this.invoiceDetails.value[index].taxRate.replace("%", "")) / 100);
    this.invoiceDetails.value[index].totalAmount = this.invoiceDetails.value[index].amount + this.invoiceDetails.value[index].taxAmount;
    this.invoiceDetails.value[index].invoiceId = this.invoiceId;
    this.invoiceAmount += this.invoiceDetails.value[index].totalAmount;
    if (this.invoiceDetails.value[index].invoiceId) {
      this.invoiceDetailService.createOrUpdate(this.invoiceDetails.value[index])
        .subscribe((result: any) => {
          this.notify.success("保存成功");
          this.invoiceDetails.value[index].id = result.id;
        });
    }
  }

  //删除
  del(index: number, id: any) {
    this.invoiceAmount -= this.invoiceDetails.value[index].totalAmount;
    this.invoiceDetails.removeAt(index);
    if (id) {
      this.invoiceDetailService.delete(id).subscribe(() => {
        this.notify.success('删除成功！');
      });
    }
  }

  //提交
  onSubmit() {
    this.notify.success("保存成功");
    this.success(this.invoiceAmount);
  }

}

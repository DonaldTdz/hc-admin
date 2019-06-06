import { Component, OnInit, Injector, Input } from '@angular/core';
import { InvoiceDetail } from 'entities'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectDetailService, InvoiceDetailService, PurchaseDetailService, DataDictionaryService } from 'services'
import { ModalComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-create-or-update-invoicedetail',
  templateUrl: './create-or-update-invoicedetail.component.html',
  providers: [PurchaseDetailService]
})
export class CreateOrUpdateInvoicedetailComponent extends ModalComponentBase implements OnInit {
  invoiceDetail: InvoiceDetail = new InvoiceDetail();
  form: FormGroup;
  @Input() id: any;
  @Input() refId: any;
  @Input() invoiceId: any;
  @Input() invoiceType: any;
  refDetailList: any;
  taxRateDictionaries: any;
  constructor(injector: Injector, private projectDetailService: ProjectDetailService, private invoiceDetailService: InvoiceDetailService
    , private fb: FormBuilder, private purchaseDetailService: PurchaseDetailService, private dataDictionaryService: DataDictionaryService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      refId: [null, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required, Validators.maxLength(25)])],
      specification: [null, Validators.compose([Validators.maxLength(100)])],
      unit: [null, Validators.compose([Validators.maxLength(25)])],
      num: [null, Validators.compose([Validators.maxLength(18)])],
      price: [null, Validators.compose([Validators.maxLength(18)])],
      taxRate: [null, Validators.compose([Validators.maxLength(25)])]
    });

    if (this.invoiceType == 1) {
      this.getProjectDetailList();
    } else {
      this.getpurchaseDetailList();
    }
    this.getTaxRateDictionaries();
    if (this.id) {
      this.getData();
      this.title = "编辑发票明细";
    } else {
      this.title = "新增发票明细";
      this.invoiceDetail.invoiceId = this.invoiceId;
    }
  }

  getProjectDetailList() {
    this.projectDetailService.GetDropDownsByProjectId(this.refId).subscribe((result) => {
      this.refDetailList = result;
    })
  }

  getpurchaseDetailList() {
    this.purchaseDetailService.GetDropDownsByPurchaseId(this.refId).subscribe((result) => {
      this.refDetailList = result;
    });
  }

  getTaxRateDictionaries() {
    this.dataDictionaryService.getDropDownDtos("5").subscribe((result) => {
      this.taxRateDictionaries = result;
    });
  }


  getData() {
    this.invoiceDetailService.getById(this.id).subscribe((result) => {
      this.invoiceDetail = result;
    });
  }

  renderForm() {
    // let projectDetailId: any;
    if (this.invoiceDetail.refId) {
      if (this.invoiceType == 1) {
        this.projectDetailService.GetById(this.invoiceDetail.refId).subscribe((result) => {
          this.invoiceDetail.specification = result.specification;
          this.invoiceDetail.unit = result.unit;
          this.invoiceDetail.name = result.name;
          if (!this.invoiceDetail.price)
            this.invoiceDetail.price = result.price;
          if (!this.invoiceDetail.num)
            this.invoiceDetail.num = result.num;
        });
      } else {
        this.purchaseDetailService.getById(this.invoiceDetail.refId).subscribe((result) => {
          // projectDetailId = result.projectDetailId;
          if (!this.invoiceDetail.price)
            this.invoiceDetail.price = result.price;
          this.projectDetailService.GetById(result.projectDetailId).subscribe((result) => {
            this.invoiceDetail.specification = result.specification;
            if (!this.invoiceDetail.num)
              this.invoiceDetail.num = result.num;
            this.invoiceDetail.unit = result.unit;
            this.invoiceDetail.name = result.name;
          });
        });
      }
    }
  }

  save() {
    this.invoiceDetailService.createOrUpdate(this.invoiceDetail).finally(() => {
      this.saving = false;
    }).subscribe(() => {
      this.notify.success('保存成功！');
      this.success();
    });
  }

}

import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, DataDictionaryService } from 'services'
import { ModalComponentBase } from '@shared/component-base';
import { Product } from 'entities'

@Component({
  selector: 'app-create-or-update-product',
  templateUrl: './create-or-update-product.component.html',
  providers: [DataDictionaryService]
})
export class CreateOrUpdateProductComponent extends ModalComponentBase implements OnInit {
  @Input() id: number;
  title: string;
  form: FormGroup;
  taxRates = [];
  product: Product = new Product();
  constructor(injector: Injector, private productService: ProductService, private fb: FormBuilder
    , private dataDictionaryService: DataDictionaryService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      specification: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      price: [null, Validators.compose([Validators.maxLength(18), Validators.required])],
      taxRate: [null, Validators.compose([Validators.required])],
      num: [null, Validators.compose([Validators.maxLength(18)])],
    });
    this.getTaxRates();
    if (this.id) {
      this.getData();
      this.title = "编辑产品";
    } else {
      this.title = "新增产品";
    }
  }

  getTaxRates() {
    this.dataDictionaryService.getDropDownDtos("8").subscribe((result) => {
      this.taxRates = result;
    })
  }

  getData() {
    this.productService.getById(this.id.toString()).subscribe((result) => {
      this.product = result;
    });
  }

  save() {
    this.product.type = 0;
    this.productService.createOrUpdate(this.product).finally(() => {
      this.saving = false;
    }).subscribe((result: any) => {
      if (result.code == 0) {
        this.notify.error(result.msg);
      } else {
        this.notify.success(result.msg);
        this.success();
      }
    });
  }

}

import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'services'
import { ModalComponentBase } from '@shared/component-base';
import { Product } from 'entities'

@Component({
  selector: 'app-create-or-update-product',
  templateUrl: './create-or-update-product.component.html',
  styles: []
})
export class CreateOrUpdateProductComponent extends ModalComponentBase implements OnInit {
  @Input() id: number;
  title: string;
  form: FormGroup;
  product: Product = new Product();
  constructor(injector: Injector, private productService: ProductService, private fb: FormBuilder) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      specification: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      unit: [null, Validators.compose([Validators.maxLength(25)])],
    });
    if (this.id) {
      this.getData();
      this.title = "编辑产品";
    } else {
      this.title = "新增产品";
    }
  }

  getData() {
    this.productService.GetById(this.id.toString()).subscribe((result) => {
      this.product = result;
    });
  }

  save() {
    this.product.type = 0;
    this.productService.createOrUpdate(this.product).finally(() => {
      this.saving = false;
    }).subscribe(() => {
      this.notify.success('保存成功！');
      this.success();
    });
  }

}

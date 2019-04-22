import { Component, OnInit, Injector, Input } from '@angular/core';
import { ProjectDetail } from 'entities'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectDetailService, ProductService, DataDictionaryService } from 'services'
import { ModalComponentBase } from '@shared/component-base';
import { SelectionProductComponent } from '@app/base/product/selection-product/selection-product.component'

@Component({
  selector: 'app-create-or-update-projectdetail',
  templateUrl: './create-or-update-projectdetail.component.html',
  styles: []
})
export class CreateOrUpdateProjectdetailComponent extends ModalComponentBase implements OnInit {
  projectDetail: ProjectDetail = new ProjectDetail();
  form: FormGroup;
  @Input() id: any;
  @Input() projectId: any;
  isInput = "true";
  projectDetailTypeList: any;
  productList: any;
  constructor(injector: Injector, private projectDetailService: ProjectDetailService, private productService: ProductService
    , private fb: FormBuilder, private dataDictionaryService: DataDictionaryService) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      type: [null, Validators.compose([Validators.required])],
      product: [null],
      name: [null, Validators.compose([Validators.maxLength(100)])],
      specification: [null, Validators.compose([Validators.maxLength(100)])],
      unit: [null, Validators.compose([Validators.maxLength(25)])],
      num: [null, Validators.compose([Validators.maxLength(18)])],
      price: [null, Validators.compose([Validators.maxLength(18)])],
    });
    this.getProjectDetailTypeList();
    if (this.id) {
      this.getData();
      this.title = "编辑项目明细";
    } else {
      this.title = "新增项目明细";
    }
  }

  getProjectDetailTypeList() {
    this.dataDictionaryService.getDropDownDtos("2").subscribe((result) => {
      this.projectDetailTypeList = result;
    });
  }

  getData() {
    this.projectDetailService.GetById(this.id).subscribe((result) => {
      this.projectDetail = result;
    });
  }

  // getProductList() {
  //   if (this.projectDetail.type == "商品采购") {
  //     this.productService.getDropDownDtos().subscribe((result) => {
  //       this.productList = result;
  //     });
  //   }
  // }
  productSelection() {
    this.modalHelper.open(SelectionProductComponent, {}, 'md', {
      nzMask: true
    }).subscribe(result => {
      if (result) {
        this.projectDetail.name = result.name;
        this.projectDetail.specification = result.specification;
        this.projectDetail.unit = result.unit;
        this.projectDetail.productId = result.id;
        this.isInput = "false";
        // this.refreshProjectDetails();
      }
    });
  }

  save() {
    this.projectDetail.projectId = this.projectId;
    this.projectDetailService.createOrUpdate(this.projectDetail).finally(() => {
      this.saving = false;
    }).subscribe(() => {
      this.notify.success('保存成功！');
      this.success();
    });
  }

}

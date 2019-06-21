import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProjectDetailService, ProductService, DataDictionaryService } from 'services'
import { ModalComponentBase } from '@shared/component-base';

@Component({
  selector: 'app-modify-projectdetail',
  templateUrl: './modify-projectdetail.component.html',
  styles: []
})
export class ModifyProjectdetailComponent extends ModalComponentBase implements OnInit {
  // projectDetail: ProjectDetail = new ProjectDetail();
  form: FormGroup;
  @Input() projectId: number;
  editIndex = -1;
  editObj = {};
  totalAmount: number = 0;
  // projectDetails: any = [];
  constructor(injector: Injector, private projectDetailService: ProjectDetailService, private fb: FormBuilder) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      projectDetails: this.fb.array([]),
    });
    this.title = "预计成本";
  }

  projectDetail(): FormGroup {
    return this.fb.group({
      num: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]]
    });
  }

  get projectDetails() {
    return this.form.controls.projectDetails as FormArray;
  }

  //新增
  add() {
    this.projectDetails.push(this.projectDetail());
    this.edit(this.projectDetails.length - 1);
  }

  //修改
  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.projectDetails.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.projectDetails.at(index).value };
    this.editIndex = index;
    this.totalAmount -= this.projectDetails.value[index].num * this.projectDetails.value[index].price;
  }

  //保存
  save(index: number) {
    this.projectDetails.at(index).markAsDirty();
    if (this.projectDetails.at(index).invalid) return;
    this.editIndex = -1;
    this.totalAmount += this.projectDetails.value[index].num * this.projectDetails.value[index].price;
    this.projectDetails.value[index].projectId = this.projectId;
  }

  //删除
  del(index: number) {
    this.totalAmount -= this.projectDetails.value[index].num * this.projectDetails.value[index].price;
    this.projectDetails.removeAt(index);
    this.editIndex = -1;
  }

  //取消
  cancel(index: number) {
    if (!this.projectDetails.at(index).value.name) {
      this.del(index);
    } else {
      this.projectDetails.at(index).patchValue(this.editObj);
    }
    this.editIndex = -1;
  }

  //提交
  onSubmit() {
    this.projectDetailService.batchCreate(this.projectDetails.value).finally(() => {
      this.saving = false;
    }).subscribe(() => {
      this.notify.success("保存成功");
      this.success();
    });
  }

}

import { Component, OnInit, Input, Injector } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ContractDetailService } from 'services';
import { ModalComponentBase } from '@shared/component-base';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';

@Component({
  selector: 'app-modif-contractdetail',
  templateUrl: './modif-contractdetail.component.html',
  styles: [],
  providers: [ContractDetailService]
})
export class ModifContractdetailComponent extends ModalComponentBase implements OnInit {
  form: FormGroup;
  @Input() contractId: number;
  editIndex = -1;
  loading: boolean = false;
  contractAmount: number = 0;
  editObj: any;
  title: string;
  // totalAmount: number = 0;
  constructor(injector: Injector, private contractDetailService: ContractDetailService, private fb: FormBuilder) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      contractDetails: this.fb.array([]),
    });
    this.title = "编辑合同明细";
    if (this.contractId) {
      this.getContracts();
    }
  }

  //获取合同明细
  getContracts() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = 0;
    params.MaxResultCount = 10;
    params.contractId = this.contractId;
    this.contractDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      for (let item of result.items) {
        item.totalAmount = item.num * (item.price * 100) / 100;
        const field = this.contractDetail();
        field.patchValue(item);
        this.contractDetails.push(field);
        this.contractAmount += item.totalAmount;
      }
    });
  }

  contractDetail(): FormGroup {
    return this.fb.group({
      id: [null],
      contractId: [null],
      name: [null, [Validators.required, Validators.maxLength(50)]],
      model: [null, [Validators.required, Validators.maxLength(50)]],
      price: [null, [Validators.required, Validators.maxLength(18)]],
      num: [null, [Validators.required, Validators.maxLength(18)]],
      totalAmount: [null],
      creationTime: [null],
      creatorUserId: [null],
    });
  }

  get contractDetails() {
    return this.form.controls.contractDetails as FormArray;
  }

  //新增
  add() {
    this.contractDetails.push(this.contractDetail());
    this.edit(this.contractDetails.length - 1);
  }

  //修改
  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.contractDetails.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.contractDetails.at(index).value };
    this.editIndex = index;
    if (this.contractDetails.value[index].totalAmount)
      this.contractAmount -= this.contractDetails.value[index].totalAmount;
  }

  //保存
  save(index: number) {
    this.contractDetails.at(index).markAsDirty();
    if (this.contractDetails.at(index).invalid) return;
    if (!this.contractDetails.value[index].id && this.editObj.id) {
      this.contractDetails.value[index].id = this.editObj.id;
      this.contractDetails.value[index].creationTime = this.editObj.creationTime;
      this.contractDetails.value[index].creatorUserId = this.editObj.creatorUserId;
    }
    if (!this.contractDetails.value[index].id) {
      delete (this.contractDetails.value[index].creationTime);
      delete (this.contractDetails.value[index].creatorUserId);
    }
    this.editIndex = -1;
    this.contractDetails.value[index].totalAmount = this.contractDetails.value[index].num * (this.contractDetails.value[index].price * 100) / 100;
    this.contractDetails.value[index].contractId = this.contractId;
    this.contractAmount += this.contractDetails.value[index].totalAmount;
    if (this.contractDetails.value[index].contractId) {
      this.contractDetailService.createOrUpdate(this.contractDetails.value[index])
        .subscribe((result: any) => {
          this.notify.success("保存成功");
          this.contractDetails.value[index].id = result.id;
          this.contractDetails.value[index].creationTime = result.creationTime;
          this.contractDetails.value[index].creatorUserId = result.creatorUserId;
        });
    }
  }

  //删除
  del(index: number, id: any) {
    this.contractAmount -= this.contractDetails.value[index].totalAmount;
    this.contractDetails.removeAt(index);
    if (id) {
      this.contractDetailService.delete(id).subscribe(() => {
        this.notify.success('删除成功！');
      });
    }
  }

  //提交
  onSubmit() {
    if (!this.contractId) {
      this.notify.success("保存成功");
      this.success({ 'contractDetails': this.contractDetails.value, 'contractAmount': this.contractAmount });
    } else {
      this.notify.success("保存成功");
      this.success({ 'contractAmount': this.contractAmount });
    }
  }

}

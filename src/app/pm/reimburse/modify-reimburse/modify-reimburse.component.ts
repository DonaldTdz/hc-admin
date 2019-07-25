import { Component, OnInit, Injector } from '@angular/core';
import { Reimburse } from 'entities'
import { AppComponentBase } from '@shared/app-component-base';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProjectService, ReimburseService } from 'services'
import { ModifyReimburseDetailComponent } from '../modify-reimbursedetail/modify-reimbursedetail.component';

@Component({
  selector: 'app-modify-reimburse',
  templateUrl: './modify-reimburse.component.html',
  providers: [ReimburseService]
})
export class ModifyReimburseComponent extends AppComponentBase implements OnInit {
  // @Input() reimburseId;
  reimburse: Reimburse = new Reimburse();

  form: FormGroup;
  projects = [];
  reimburseDetails = [];
  pageSize = 200;
  pageIndex = 1;

  reimburseType: any[] = [{ text: '项目型报销', value: 1 }, { text: '非项目报销', value: 2 }];

  constructor(injector: Injector, private fb: FormBuilder, private projectService: ProjectService, private reimburseService: ReimburseService) {
    super(injector);
  }

  ngOnInit() {
    this.form = this.fb.group({
      projectId: [null],
      amount: [null, Validators.compose([Validators.maxLength(18), Validators.required])],
      type: [null, Validators.compose([Validators.required])],
      remark: [null, Validators.maxLength(250)]
    });
    this.reimburse.amount = 0;
    this.reimburse.type = 1;
    this.getProjects();
  }

  getProjects() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projects = result;
    })
  }

  //新增报销明细
  create() {
    this.modalHelper.open(ModifyReimburseDetailComponent, {}, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(returns => {
      if (returns) {
        this.reimburseDetails.push(returns);
        this.reimburse.amount += returns.amount;
      }
    });
  }

  //返回
  goBack(): void {
    history.back();
  }

  //编辑报销明细
  editReimburseDetail(item: any, index: number) {
    this.reimburse.amount -= this.reimburseDetails[index].amount;
    this.modalHelper.open(ModifyReimburseDetailComponent, { 'reimburseDetailOld': item }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(returns => {
      if (returns) {
        this.reimburseDetails[index] = returns;
        this.reimburse.amount += returns.amount;
      }
    });
  }

  del(index: number) {
    this.reimburse.amount -= this.reimburseDetails[index].amount;
    this.reimburseDetails.splice(index, 1)
  }

  save() {
    if (this.reimburse.type == 1 && !this.reimburse.projectId)
      return this.notify.warn("请选择所属项目")
    this.reimburseService.submitApproval(this.reimburse, this.reimburseDetails).finally(() => {
    }).subscribe((result: any) => {
      if (result.code == 0) {
        this.notify.success(result.msg);
        this.goBack();
        // this.vote(true);
      } else {
        this.notify.error(result.msg);
      }
    });
  }
}

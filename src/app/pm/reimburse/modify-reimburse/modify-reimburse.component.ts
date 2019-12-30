import { Component, OnInit, Injector } from '@angular/core';
import { Reimburse } from 'entities'
import { AppComponentBase } from '@shared/app-component-base';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProjectService, ReimburseService, ReimburseDetailService } from 'services'
import { ModifyReimburseDetailComponent } from '../modify-reimbursedetail/modify-reimbursedetail.component';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { PagedResultDto } from '@shared/component-base';

@Component({
  selector: 'app-modify-reimburse',
  templateUrl: './modify-reimburse.component.html',
  providers: [ReimburseService, ReimburseDetailService]
})
export class ModifyReimburseComponent extends AppComponentBase implements OnInit {
  reimburse: Reimburse = new Reimburse();
  reimburseTypeOld: number;
  reimburseProjectIdOld: string;
  form: FormGroup;
  projects = [];
  reimburseDetails = [];
  pageSize = 200;
  pageIndex = 1;

  reimburseType: any[] = [{ text: '项目型报销', value: 1 }, { text: '非项目报销', value: 2 }];

  constructor(injector: Injector, private fb: FormBuilder, private projectService: ProjectService, private actRouter: ActivatedRoute
    , private reimburseService: ReimburseService, private nzMsg: NzMessageService, private reimburseDetailService: ReimburseDetailService) {
    super(injector);
    this.reimburse.id = this.actRouter.snapshot.params['reimburseId'];
  }

  ngOnInit() {
    this.form = this.fb.group({
      projectId: [null],
      amount: [null],
      type: [null, Validators.compose([Validators.required])]
    });
    if (!this.reimburse.id) {
      this.reimburse.amount = 0;
      this.reimburse.type = 1;
    } else {
      this.getReimburse();
      this.getReimburseDetails();
    }
    this.getProjects();
  }

  getProjects() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projects = result;
    })
  }

  //获取报销
  getReimburse() {
    this.reimburseService.getById(this.reimburse.id).subscribe(res => {
      this.reimburse = res;
      this.reimburseTypeOld = res.type;
      this.reimburseProjectIdOld = res.projectId;
    });
  }

  //获取报销明细
  getReimburseDetails() {
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.ReimburseId = this.reimburse.id;
    this.reimburseDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.reimburseDetails = result.items;
    })
  }

  //新增报销明细
  create() {
    if (!this.reimburse.id || this.reimburse.type != this.reimburseTypeOld || this.reimburse.projectId != this.reimburseProjectIdOld) {
      this.saveReimburse();
    } else {
      this.modalHelper.open(ModifyReimburseDetailComponent, { 'reimburseId': this.reimburse.id }, 'md', {
        nzMask: true, nzMaskClosable: false
      }).subscribe(totalAmount => {
        if (totalAmount) {
          this.reimburse.amount = totalAmount;
          this.getReimburseDetails();
        }
      });
    }
  }

  //返回
  goBack(): void {
    history.back();
  }

  //编辑报销明细
  editReimburseDetail(item: any) {
    this.modalHelper.open(ModifyReimburseDetailComponent, { 'reimburseDetailId': item.id }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(totalAmount => {
      if (totalAmount) {
        this.reimburse.amount = totalAmount;
        this.getReimburseDetails();
      }
    });
  }

  del(reimburseDetailId: string) {
    this.reimburseDetailService.delete(reimburseDetailId).subscribe((totalAmount: number) => {
      this.nzMsg.success('删除成功！');
      this.reimburse.amount = totalAmount;
      this.getReimburseDetails();
    });
  }

  /**保存报销 */
  saveReimburse() {
    if (this.reimburse.type == 2)
      this.reimburse.projectId = null;

    if (this.reimburse.type == 1 && !this.reimburse.projectId) {
      this.nzMsg.warning('请先选择项目！');
    } else {
      this.reimburseService.createOrUpdate(this.reimburse).finally(() => {
      }).subscribe((result: any) => {
        this.reimburse.id = result.id;
        this.reimburseTypeOld = result.type;
        this.reimburseProjectIdOld = result.projectId;
        this.modalHelper.open(ModifyReimburseDetailComponent, { 'reimburseId': result.id }, 'md', {
          nzMask: true, nzMaskClosable: false
        }).subscribe(totalAmount => {
          if (totalAmount) {
            this.reimburse.amount = totalAmount;
            this.getReimburseDetails();
          }
        });
      });
    }
  }

  submitApproval() {
    this.reimburseService.submitApproval(this.reimburse.id).finally(() => {
    }).subscribe((result: any) => {
      if (result.code == 0) {
        this.nzMsg.success(result.msg);
        this.goBack();
        // this.vote(true);
      } else {
        this.nzMsg.error(result.msg);
      }
    });
  }
}

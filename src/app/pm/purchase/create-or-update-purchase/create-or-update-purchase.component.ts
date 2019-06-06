import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Purchase, PurchaseDetail } from 'entities'
import { PurchaseService, ProjectService, EmployeeServiceProxy, PurchaseDetailService } from 'services'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedResultDto } from '@shared/component-base';
import { CreateOrUpdatePurchasedetailComponent } from '../create-or-update-purchasedetail/create-or-update-purchasedetail.component'

@Component({
  selector: 'app-create-or-update-purchase',
  templateUrl: './create-or-update-purchase.component.html',
  styleUrls: ['./create-or-update-purchase.component.scss']
})
export class CreateOrUpdatePurchaseComponent extends AppComponentBase implements OnInit {
  id: string;
  projectId: string;
  loading = 'false';
  title: string;
  form: FormGroup;
  purchaseDetails = [];
  projectList: any;
  employeeList: any;
  purchase: Purchase = new Purchase();
  purchaseType = [{ text: '软件', value: 2 }, { text: '硬件', value: 1 }];
  constructor(injector: Injector, private purchaseService: PurchaseService, private datePipe: DatePipe, private fb: FormBuilder
    , private projectService: ProjectService, private purchaseDetailService: PurchaseDetailService
    , private employeeServiceProxy: EmployeeServiceProxy, private router: Router, private actRouter: ActivatedRoute) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
    this.projectId = this.actRouter.snapshot.params['projectId'];
  }

  ngOnInit() {
    this.form = this.fb.group({
      code: [null, Validators.compose([Validators.required, Validators.maxLength(35)])],
      projectId: [null, Validators.compose([Validators.required])],
      type: [null, Validators.compose([Validators.required])],
      employeeId: [null],
      purchaseDate: [null],
      desc: [null, Validators.compose([Validators.maxLength(250)])],
    });
    this.getProjectList();
    this.getEmployeeList();
    if (this.projectId) {
      this.purchase.projectId = this.projectId;
    }
    if (this.id) {
      this.getData();
      this.getPurchaseDetails();
      this.title = "编辑采购";
    } else {
      this.title = "新增采购";
    }
  }

  //获取自动生成的采购编号
  getPurchaseCode() {
    if (this.purchase.type) {
      this.purchaseService.getPurchaseCode(this.purchase.type).subscribe((resule) => {
        this.purchase.code = resule;
      });
    }
  }

  //获取采购明细列表
  getPurchaseDetails() {
    this.loading = 'true';
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.PurchaseId = this.id;
    this.purchaseDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = "false"
      this.purchaseDetails = result.items;
    })
  }

  //编辑获取数据
  getData() {
    this.purchaseService.getById(this.id.toString()).subscribe((result) => {
      this.purchase = result;
    });
  }

  //获取项目下拉列表
  getProjectList() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projectList = result;
    });
  }

  //创建采购明细
  createPurchaseDetail() {
    this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, { projectId: this.purchase.projectId, purchaseId: this.purchase.id }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe((result: any) => {
      if (!this.purchase.id) {
        if (result)
          this.purchaseDetails.push(result);
      } else {
        this.getPurchaseDetails();
      }
    });
  }

  //编辑采购明细
  editProjectDetail(purchaseDetail: PurchaseDetail, index: number) {
    if (!this.purchase.id) {
      this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, { purchaseDetail, projectId: this.purchase.projectId }, 'md', {
        nzMask: true
      }).subscribe((result: any) => {
        if (result)
          this.purchaseDetails.splice(index, 1, result);
      });
    } else {
      this.modalHelper.open(CreateOrUpdatePurchasedetailComponent, { id: purchaseDetail.id, projectId: this.purchase.projectId }, 'md', {
        nzMask: true
      }).subscribe(isSave => {
        if (isSave) {
          this.getPurchaseDetails();
        }
      });
    }
  }

  //获取人员下拉列表
  getEmployeeList() {
    this.employeeServiceProxy.getDropDownDtos().subscribe((result) => {
      this.employeeList = result;
    });
  }
  //保存
  save() {
    if (this.id) {
      this.purchaseService.createOrUpdate(this.purchase).finally(() => {
      }).subscribe((result: any) => {
        if (result.code == 1) {
          this.notify.success(result.msg);
        } else {
          this.notify.error(result.msg);
        }
      });
    } else {
      this.purchaseService.createPurchaseAndDetail(this.purchase, this.purchaseDetails).finally(() => {
      }).subscribe((result: any) => {
        if (result.code == 1) {
          this.notify.success(result.msg);
          if (result.data)
            this.router.navigate(['/app/pm/purchase-detail', { id: result.data.id }]);
        } else {
          this.notify.error(result.msg);
        }
      });
    }
  }


  //删除采购明细
  delete(purchaseDetail: PurchaseDetail, index: number) {
    if (purchaseDetail.id) {
      this.message.confirm(
        "是否删除该采购明细?",
        "信息确认",
        (result: boolean) => {
          if (result) {
            this.purchaseDetailService.delete(purchaseDetail.id).subscribe(() => {
              this.notify.success('删除成功！');
              this.getPurchaseDetails();
            });
          }
        }
      )
    } else {
      this.purchaseDetails.splice(index, 1)
    }
  }

  goBack(): void {
    history.back();
  }

}

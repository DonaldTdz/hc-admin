import { Component, OnInit, Injector } from '@angular/core';
import { Contract, ContractDetail } from 'entities'
import { ContractService, ContractDetailService } from 'services'
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CreateOrUpdateContractdetailComponent } from '../create-or-update-contractdetail/create-or-update-contractdetail.component'

@Component({
  selector: 'app-detail-contract',
  templateUrl: './detail-contract.component.html',
  styles: []
})
export class DetailContractComponent extends AppComponentBase implements OnInit {
  id: any = '';
  search: any = {};
  tableLoading = "false";
  contract: Contract = new Contract();
  attachments = [];
  title: string;
  constructor(injector: Injector, private contractService: ContractService, private actRouter: ActivatedRoute, private contractDetailService: ContractDetailService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.getData();
  }

  //获取contract数据
  getData() {
    this.contractService.getById(this.id.toString()).subscribe((result) => {
      this.contract = result;

      this.getContractDetails();
      this.jointAttachments();
      this.title = '合同编号：' + result.contractCode;
    });
  }

  //处理附件
  jointAttachments() {
    if (this.contract.attachments) {
      let items = this.contract.attachments.split(",");
      let arr = [];
      for (let item of items) {
        let fileName = item.split(":")[0];
        let fileUrl = item.split(":")[1];
        let map = { "fileName": fileName, "fileUrl": fileUrl };
        arr.push(map);
      }
      this.attachments = arr;
    } else {
      this.attachments = []
    }
  }

  //删除
  delete(entity: ContractDetail) {
    this.message.confirm(
      "是否删除该合同明细?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.contractDetailService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.ngOnInit();
          });
        }
      }
    )
  }

  //编辑
  editDing(id: any) {
    console.log(id);
    this.modalHelper.open(CreateOrUpdateContractdetailComponent, { id: id, refId: this.contract.refId, contractId: this.contract.id, contractType: this.contract.type }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.ngOnInit();
      }
    });
  }

  //新增
  create() {
    this.modalHelper.open(CreateOrUpdateContractdetailComponent, { refId: this.contract.refId, contractId: this.contract.id, contractType: this.contract.type }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.ngOnInit();
      }
    });
  }

  //查询合同明细
  getContractDetails() {
    this.tableLoading = "true"
    let params: any = {};
    // params.SkipCount = this.query.skipCount();
    // params.MaxResultCount = this.query.pageSize;
    params.contractId = this.id;
    params.Type = this.contract.type;
    this.contractDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.tableLoading = "false"
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  //返回
  return() {
    history.back();
  }

}

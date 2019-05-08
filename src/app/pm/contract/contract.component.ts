import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase, } from '@shared/app-component-base';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { ContractService } from 'services'
import { Contract } from 'entities'
import { Router } from '@angular/router';
import { CreateOrUpdateContractComponent } from './create-or-update-contract/create-or-update-contract.component'

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styles: []
})
export class ContractComponent extends AppComponentBase implements OnInit {
  loading = "false";
  @Input() refId;
  search: any = {};
  contractType = [{ text: '销项', value: 1 }, { text: '进项', value: 2 }]
  projectList: any;
  purchaseList: any;
  constructor(injector: Injector, private contractService: ContractService
    , private router: Router) { super(injector); }

  ngOnInit() {
    this.getContract();
    if (this.refId) {
      this.search.Type = 1;
    }

  }

  //查询
  getContract() {
    this.loading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.ContractCode = this.search.contractCode;
    if (this.refId)
      params.RefId = this.refId
    params.Type = this.search.type;
    this.contractService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = "false"
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  //编辑
  editDing(id: any) {
    console.log(id);
    this.modalHelper.open(CreateOrUpdateContractComponent, { id: id, refId: this.refId, type: this.search.Type }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refresh();
      }
    });
  }

  //详细
  details(id: any) {
    this.router.navigate(['/app/pm/contract-detail', { id: id }]);
  }

  //新增
  create() {
    this.modalHelper.open(CreateOrUpdateContractComponent, { refId: this.refId, type: this.search.Type }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refresh();
      }
    });
  }


  //删除
  delete(entity: Contract) {
    this.message.confirm(
      "是否删除该合同:'" + entity.contractCode + "'?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.contractService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getContract();
          });
        }
      }
    )
  }

  refresh() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getContract();
  }

}

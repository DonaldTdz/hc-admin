import { Component, OnInit, Injector } from '@angular/core';
import { CustomerService, ProjectService } from 'services';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'entities'
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';

@Component({
  selector: 'app-detail-customer',
  templateUrl: './detail-customer.component.html',
  styles: []
})
export class DetailCustomerComponent extends AppComponentBase implements OnInit {
  id: any = '';
  tableLoading = "false";
  customer: Customer = new Customer();
  constructor(injector: Injector, private customerService: CustomerService, private actRouter: ActivatedRoute, private projectService: ProjectService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.getById();
    this.getProjects();
  }


  getById() {
    if (this.id) {
      this.customerService.getById(this.id).subscribe(res => {
        this.customer = res;
      });
    }
  }

  //查询
  getProjects() {
    this.tableLoading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.CustomerId = this.id;
    this.projectService.getAll(params).subscribe((result: PagedResultDto) => {
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

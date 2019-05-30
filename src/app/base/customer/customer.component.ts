import { Component, OnInit, Injector } from '@angular/core';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CreateCustomerComponent } from "@app/base/customer/create-customer/create-customer.component";
import { EditCustomerComponent } from '@app/base/customer/edit-customer/edit-customer.component';
import { AppComponentBase } from '@shared/app-component-base';
import { Customer } from 'entities';
import { CustomerService } from 'services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styles: []
})

export class CustomerComponent extends AppComponentBase implements OnInit {
  search: any = {};
  tableLoading = "false";
  customerTypes = [
    { value: 0, text: '全部' },
    { value: 1, text: '企业' },
    { value: 2, text: '个人' },
    { value: 3, text: '其他' },
  ];

  constructor(injector: Injector, private customerService: CustomerService, private router: Router) {
    super(injector);
  }

  ngOnInit() {
    this.getProjects();
  }

  //查询
  getProjects() {
    this.tableLoading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.Name = this.search.name;
    params.Type = this.search.type;
    this.customerService.getPage(params).subscribe((result: PagedResultDto) => {
      this.tableLoading = "false";
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  详细
  details(id: any) {
    this.router.navigate(['/app/base/customer-detail', { id: id }]);
  }

  //新增
  create() {
    this.modalHelper.open(CreateCustomerComponent, {}, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(isSave => {
      if (isSave) {
        this.getProjects();
      }
    });
  }
  //删除
  delete(entity: Customer) {
    this.message.confirm(
      "删除'" + entity.name + "'客户?",
      '信息确认',
      (result: boolean) => {
        if (result) {
          this.customerService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getProjects();
          });
        }
      }
    );
  }

  //更新
  edit(item: Customer): void {
    this.modalHelper.open(EditCustomerComponent, { id: item.id }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(isSave => {
      if (isSave) {
        this.getProjects();
      }
    });
  }

}

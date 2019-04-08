import { Component, OnInit, Injector } from '@angular/core';
import { PagedRequestDto, PagedListingComponentBase, PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CreateCustomerComponent } from "@app/base/customer/create-customer/create-customer.component";
import { EditCustomerComponent } from '@app/base/customer/edit-customer/edit-customer.component';
import { Customer } from 'entities';
import { CustomerService } from 'services';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styles: []
})

export class CustomerComponent extends PagedListingComponentBase<Customer> {
  param: any = { type: 0 };
  name: "";
  customerTypes = [
    { value: 0, text: '全部' },
    { value: 1, text: '企业' },
    { value: 2, text: '个人' },
    { value: 3, text: '其他' },
  ];
  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    //图文消息
    finishedCallback();
    this.customerService.getPage(this.getParameter()).finally(() => {
      finishedCallback();
    }).subscribe((result: PagedResultDto) => {
      this.dataList = result.items;
      this.totalItems = result.totalCount;
    })
  }

  constructor(injector: Injector, private customerService: CustomerService) {
    super(injector);

  }

  //新增
  create() {
    this.modalHelper.open(CreateCustomerComponent, {}, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refresh();
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
            this.refresh();
          });
        }
      }
    );
  }

  //更新
  edit(item: Customer): void {
    this.modalHelper.open(EditCustomerComponent, { id: item.id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refresh();
      }
    });
  }
  getParameter(): any {
    var arry: any = {};
    arry.name = this.param.name;
    arry.type = this.param.type === 0 ? null : this.param.type;
    return arry;
  }

}

import { Component, OnInit, Injector } from '@angular/core';
import { PagedRequestDto, PagedListingComponentBase, PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CreateCustomerMessageComponent } from '@app/base/customer/create-customer-message/create-customer-message.component';
import { EditCustomerMessageComponent } from '@app/base/customer/edit-customer-message/edit-customer-message.component';
import { Customer } from 'entities';
import { CustomerService } from 'services';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styles: []
})

export class CustomerComponent extends PagedListingComponentBase<Customer> {
  param: any = { triType: 0, msType: 0 };
  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    finishedCallback();
    this.customerService.getPage(request).finally(() => {
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
    this.modalHelper.open(CreateCustomerMessageComponent, {}, 'md', {
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
    this.modalHelper.open(EditCustomerMessageComponent, { id: item.id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refresh();
      }
    });
  }


}

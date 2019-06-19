import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CustomerContactService } from 'services';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CustomerContact } from 'entities';
import { ModifyCustomerContactComponent } from './modify-customer-contact/modify-customer-contact.component'
import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-customer-contact',
  templateUrl: './customer-contact.component.html',
  styles: []
})
export class CustomerContactComponent extends AppComponentBase implements OnInit {
  @Input() customerId: any;
  loading: boolean = false;
  constructor(injector: Injector, private customerContactService: CustomerContactService, private nzMsg: NzMessageService) {
    super(injector);
  }

  ngOnInit() {
    console.log(this.customerId);
    if (this.customerId)
      this.getCustomerContacts();
  }

  //查询
  getCustomerContacts() {
    this.loading = true
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.CustomerId = this.customerId;
    this.customerContactService.getPage(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  delete(entity: CustomerContact) {
    this.message.confirm(
      "是否确认删除该联系人:'" + entity.name + "'?",
      '信息确认',
      (result: boolean) => {
        if (result) {
          this.customerContactService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getCustomerContacts();
          });
        }
      }
    )
  }

  editDing(item: CustomerContact) {
    this.modalHelper.open(ModifyCustomerContactComponent, { id: item.id, customerId: this.customerId }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(isSave => {
      if (isSave) {
        this.getCustomerContacts();
      }
    });
  }
  create() {
    if (!this.customerId)
      return this.nzMsg.warning("请先保存客户")
    this.modalHelper.open(ModifyCustomerContactComponent, { customerId: this.customerId }, 'md', {
      nzMask: true, nzMaskClosable: false
    }).subscribe(isSave => {
      if (isSave) {
        this.getCustomerContacts();
      }
    });
  }

}

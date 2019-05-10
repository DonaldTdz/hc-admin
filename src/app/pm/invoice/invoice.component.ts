import { Component, OnInit, ViewChild, Injector, Input } from '@angular/core';
import { STComponent, STColumn, STChange, STPage } from '@delon/abc';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { InvoiceService } from 'services'
import { Invoice } from 'entities'
import { Router } from '@angular/router';
import { AppComponentBase, } from '@shared/app-component-base';
import { CreateOrUpdateInvoiceComponent } from './create-or-update-invoice/create-or-update-invoice.component'

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
})
export class InvoiceComponent extends AppComponentBase implements OnInit {
  search: any = {};
  @Input() projectId;
  @Input() purchaseId;
  refId: string;
  loading = false;
  invoiceType = [{ text: '销项', value: 1 }, { text: '进项', value: 2 }];

  constructor(injector: Injector, private invoiceService: InvoiceService, private router: Router) { super(injector); }

  ngOnInit() {
    this.getInvoices();
  }

  getInvoices() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.Title = this.search.title;
    if (this.purchaseId) {
      this.search.Type = 2;
      this.refId = this.purchaseId;
      params.RefId = this.refId
    } else if (this.projectId) {
      this.search.Type = 1;
      this.refId = this.projectId;
      params.RefId = this.refId
    }
    params.Code = this.search.code;
    this.invoiceService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  //编辑
  editDing(id: any) {
    console.log(id);
    this.modalHelper.open(CreateOrUpdateInvoiceComponent, { id: id, refId: this.refId, type: this.search.Type }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refresh();
      }
    });
  }

  //详细
  details(id: any) {
    this.router.navigate(['/app/pm/invoice-detail', { id: id }]);
  }

  //新增
  create() {
    this.modalHelper.open(CreateOrUpdateInvoiceComponent, { refId: this.refId, type: this.search.Type }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refresh();
      }
    });
  }


  //删除
  delete(entity: Invoice) {
    this.message.confirm(
      "是否删除该发票:'" + entity.title + "'?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.invoiceService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getInvoices();
          });
        }
      }
    )
  }

  refresh() {
    this.search = {};
    this.query.pageIndex = 1;
    this.getInvoices();
  }
}

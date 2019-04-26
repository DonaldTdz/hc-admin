import { Component, OnInit, ViewChild, Injector } from '@angular/core';
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
  styles: []
})
export class InvoiceComponent extends AppComponentBase implements OnInit {
  search: any = {};
  data: any[] = [];
  total: any;
  loading = false;
  invoiceType = [{ text: '销项', value: 1 }, { text: '进项', value: 2 }];
  pages: STPage = {
    total: true,//分页显示多少条数据，字符串型
    show: true,//显示分页
    front: false, //关闭前端分页，true是前端分页，false后端控制分页
    showSize: true,
    pageSizes: [10, 20, 30, 40]
  };
  @ViewChild('st')
  st: STComponent;
  columns: STColumn[] = [
    { title: 'refId', index: 'refId' },
    { title: '发票抬头', index: 'title' },
    { title: '发票分类', index: 'typeName' },
    { title: '发票号', index: 'code' },
    { title: '发票金额', index: 'amount' },
    { title: '开票日期', index: 'submitDate', type: 'date', dateFormat: 'YYYY-MM-DD' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          click: (item: any) => this.editDing(item.id),
        },
        {
          text: '删除',
          click: (item: any) => this.delete(item),
        },
        {
          text: '详情',
          click: (item: any) => this.details(item.id),
        }
      ],
    },
  ];

  constructor(injector: Injector, private invoiceService: InvoiceService, private router: Router) { super(injector); }

  ngOnInit() {
    this.getInvoices();
  }

  getInvoices() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = (this.st.pi - 1) * this.st.ps;
    params.MaxResultCount = this.st.ps;
    params.Type = this.search.type;
    params.Title = this.search.title;
    params.Code = this.search.code;
    this.invoiceService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'pi':
        this.getInvoices();
        break;
      case 'ps':
        this.getInvoices();
        break;
    }
  }

  //编辑
  editDing(id: any) {
    console.log(id);
    this.modalHelper.open(CreateOrUpdateInvoiceComponent, { id: id }, 'md', {
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
    this.modalHelper.open(CreateOrUpdateInvoiceComponent, {}, 'md', {
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
    this.st.reset();
  }
}

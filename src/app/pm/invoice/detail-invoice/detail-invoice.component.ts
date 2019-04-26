import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Invoice, InvoiceDetail } from 'entities'
import { InvoiceService, InvoiceDetailService } from 'services'
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CreateOrUpdateInvoicedetailComponent } from '../create-or-update-invoicedetail/create-or-update-invoicedetail.component'
import { STComponent, STColumn, STChange } from '@delon/abc';

@Component({
  selector: 'app-detail-invoice',
  templateUrl: './detail-invoice.component.html',
  styles: []
})
export class DetailInvoiceComponent extends AppComponentBase implements OnInit {
  id: any = '';
  search: any = {};
  loading = false;
  invoice: Invoice = new Invoice();
  attachments = [];
  title: string;
  @ViewChild('st')
  st: STComponent;
  columns: STColumn[] = [
    { title: 'refId', index: 'refId' },
    { title: '劳务或服务名称', index: 'name' },
    { title: '规格型号', index: 'Specification' },
    { title: '单位', index: 'unit' },
    { title: '数量', index: 'num' },
    { title: '单价', index: 'price' },
    { title: '税率', index: 'taxRate' },
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
        }
      ],
    },
  ];
  constructor(injector: Injector, private invoiceService: InvoiceService, private actRouter: ActivatedRoute, private invoiceDetailService: InvoiceDetailService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.geInvoices();
  }

  //获取invoice数据
  geInvoices() {
    this.invoiceService.getById(this.id.toString()).subscribe((result) => {
      this.invoice = result;
      this.jointAttachments();
      this.title = '发票号：' + result.code;
    });
  }

  //处理附件
  jointAttachments() {
    if (this.invoice.attachments) {
      let items = this.invoice.attachments.split(",");
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

  //查询发票明细
  getInvoiceDetails() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = (this.st.pi - 1) * this.st.ps;
    params.MaxResultCount = this.st.ps;
    params.InvoiceId = this.id;
    this.invoiceService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'pi':
        this.getInvoiceDetails();
        break;
      case 'ps':
        this.getInvoiceDetails();
        break;
    }
  }

  //编辑
  editDing(id: any) {
    console.log(id);
    this.modalHelper.open(CreateOrUpdateInvoicedetailComponent, { id: id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getInvoiceDetails();
      }
    });
  }

  //新增
  create() {
    this.modalHelper.open(CreateOrUpdateInvoicedetailComponent, {}, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.getInvoiceDetails();
      }
    });
  }


  //删除
  delete(entity: Invoice) {
    this.message.confirm(
      "是否删除该发票明细?",
      "信息确认",
      (result: boolean) => {
        if (result) {
          this.invoiceDetailService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.getInvoiceDetails();
          });
        }
      }
    )
  }

  //返回
  return() {
    history.back();
  }

}

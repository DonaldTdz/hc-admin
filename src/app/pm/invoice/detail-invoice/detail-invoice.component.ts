import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Invoice, InvoiceDetail } from 'entities'
import { InvoiceService, InvoiceDetailService } from 'services'
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { CreateOrUpdateInvoicedetailComponent } from '../create-or-update-invoicedetail/create-or-update-invoicedetail.component'
import { STComponent, STColumn, STChange, STPage } from '@delon/abc';

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
  pages: STPage = {
    total: true,//分页显示多少条数据，字符串型
    show: false,//显示分页
    front: false, //关闭前端分页，true是前端分页，false后端控制分页
    showSize: true,
    pageSizes: [10, 20, 30, 40]
  };
  @ViewChild('st')
  st: STComponent;
  columns: STColumn[] = [
    { title: '项目/采购明细名称', index: 'refName' },
    { title: '劳务或服务名称', index: 'name' },
    { title: '规格型号', index: 'specification' },
    { title: '单位', index: 'unit' },
    { title: '数量', index: 'num', className: 'text-right' },
    { title: '单价(元)', index: 'price', className: 'text-right' },
    { title: '税率', index: 'taxRate', className: 'text-center' },
    {
      title: '操作',
      className: 'text-center',
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
      this.getInvoiceDetails();
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
    // params.SkipCount = (this.st.pi - 1) * this.st.ps;
    // params.MaxResultCount = this.st.ps;
    params.InvoiceId = this.id;
    params.Type = this.invoice.type;
    this.invoiceDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  // stChange(e: STChange) {
  //   switch (e.type) {
  //     case 'pi':
  //       this.getInvoiceDetails();
  //       break;
  //     case 'ps':
  //       this.getInvoiceDetails();
  //       break;
  //   }
  // }

  //编辑
  editDing(id: any) {
    this.modalHelper.open(CreateOrUpdateInvoicedetailComponent, { id: id, refId: this.invoice.refId, invoiceType: this.invoice.type }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.geInvoices();
      }
    });
  }

  //新增
  create() {
    this.modalHelper.open(CreateOrUpdateInvoicedetailComponent, { refId: this.invoice.refId, invoiceType: this.invoice.type, invoiceId: this.invoice.id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.geInvoices();
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
            this.geInvoices();
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

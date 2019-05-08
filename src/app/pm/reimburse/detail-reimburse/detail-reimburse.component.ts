import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { STComponent, STColumn, STChange, STPage } from '@delon/abc';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { ReimburseService, ReimburseDetailService } from 'services'
import { Reimburse, ReimburseDetail } from 'entities'
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase, } from '@shared/app-component-base';
import { DetailReimbursedetailsComponent } from '../detail-reimbursedetails/detail-reimbursedetails.component'

@Component({
  selector: 'app-detail-reimburse',
  templateUrl: './detail-reimburse.component.html',
  styles: []
})
export class DetailReimburseComponent extends AppComponentBase implements OnInit {
  id: any = '';
  loading = false;
  reimburse: Reimburse = new Reimburse();
  attachments = [];
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
    // { title: '编号', index: 'id', type: 'radio' },
    { title: '发生日期', index: 'happenDate', type: 'date', dateFormat: 'YYYY-MM-DD HH:mm:ss' },
    { title: '类型', index: 'type' },
    { title: '发生地点', index: 'place' },
    { title: '客户', index: 'customer' },
    { title: '费用说明', index: 'desc' },
    { title: '金额(元)', index: 'amount', className: 'text-right' },
    { title: '票据张数', index: 'invoiceNum', className: 'text-right' },
    // { title: '备注', index: 'remark' }
    {
      title: '操作',
      className: 'text-center',
      buttons: [
        {
          text: '查看详情',
          type: "link",
          click: (item: any) => this.details(item.id),
        }
      ],
    },
  ];
  constructor(injector: Injector, private reimburseService: ReimburseService, private actRouter: ActivatedRoute, private reimburseDetailService: ReimburseDetailService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.geInvoices();
    this.getReimburseDetails();
  }

  //获取invoice数据
  geInvoices() {
    this.reimburseService.getById(this.id.toString()).subscribe((result) => {
      this.reimburse = result;
    });
  }

  //查询报销明细
  getReimburseDetails() {
    this.loading = true;
    let params: any = {};
    params.SkipCount = (this.st.pi - 1) * this.st.ps;
    params.MaxResultCount = this.st.ps;
    params.ReimburseId = this.id;
    this.reimburseDetailService.getAll(params).subscribe((result: PagedResultDto) => {
      this.loading = false;
      this.query.data = result.items;
      this.query.total = result.totalCount;
    })
  }

  details(id: any) {
    this.modalHelper.open(DetailReimbursedetailsComponent, { id: id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
    });
  }


  stChange(e: STChange) {
    switch (e.type) {
      case 'pi':
        this.getReimburseDetails();
        break;
      case 'ps':
        this.getReimburseDetails();
        break;
    }
  }

  //返回
  return() {
    history.back();
  }

}

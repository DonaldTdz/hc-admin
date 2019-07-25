import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { ReimburseDetail } from 'entities'
import { ReimburseDetailService } from 'services'

@Component({
  selector: 'app-detail-reimbursedetails',
  templateUrl: './detail-reimbursedetails.component.html',
  providers: [ReimburseDetailService]
})
export class DetailReimbursedetailsComponent extends ModalComponentBase implements OnInit {
  @Input() id: number;
  attachments = [];
  reimburseDetail: ReimburseDetail = new ReimburseDetail();
  constructor(injector: Injector, private reimburseDetailService: ReimburseDetailService) { super(injector); }

  ngOnInit() {
    this.getData();
  }

  //编辑获取数据
  getData() {
    this.reimburseDetailService.getById(this.id.toString()).subscribe((result) => {
      this.reimburseDetail = result;
      this.jointAttachments();
      // this.getRefList();
    });
  }

  //处理附件
  jointAttachments() {
    if (this.reimburseDetail.attachments) {
      let items = this.reimburseDetail.attachments.split(",");
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

}

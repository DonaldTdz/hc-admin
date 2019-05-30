import { Component, OnInit, Injector } from '@angular/core';
import { Tender } from 'entities'
import { TenderService } from 'services'
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-tender',
  templateUrl: './detail-tender.component.html',
  styles: []
})
export class DetailTenderComponent extends AppComponentBase implements OnInit {
  id: any = '';
  tender: Tender = new Tender();
  attachments = [];
  constructor(injector: Injector, private tenderService: TenderService, private actRouter: ActivatedRoute) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.getData();
  }

  //编辑获取数据
  getData() {
    // this.tenderService.getById(this.id.toString()).subscribe((result) => {
    //   this.tender = result;
    //   this.jointAttachments()
    // });
  }

  //处理附件
  jointAttachments() {
    if (this.tender.attachments) {
      let items = this.tender.attachments.split(",");
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

  //返回
  return() {
    history.back();
  }

}

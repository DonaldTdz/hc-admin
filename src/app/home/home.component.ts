import { Component, Injector, AfterViewInit, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/component-base/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { ACLService } from '@delon/acl';
import { HomeService, TenderService } from 'services';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  providers: [TenderService],
  animations: [appModuleAnimation()],
})
export class HomeComponent extends AppComponentBase implements OnInit {

  homeInfo: any;
  integralStatis = [];
  goodsStatis = [];
  integralMoth = [];
  integralStatisData = [];
  goodsStatisData = [];
  integralMothData = [];
  inTotal: number;
  goodTotal: number;
  inMoth = { growthTotal: null, depleteTotal: null }
  searchMoth = 2;
  tags = [
    { value: 1, text: '近半年' },
    { value: 2, text: '近一年' },
  ];
  colors = ['#1890ff', '#eb2f96'];
  constructor(
    injector: Injector, private http: _HttpClient, public msg: NzMessageService,
    private aclService: ACLService, private homeService: HomeService, private tenderService: TenderService,
    private _nzNotificationService: NzNotificationService
  ) {
    super(injector);
  }
  ngOnInit(): void {

    this._nzNotificationService.config({
      nzPlacement: 'bottomRight',
      nzDuration: 120000
    });
    this.getTenderRemindData();
  }

  getTenderRemindData() {
    // let tenderRemindData;
    this.tenderService.getTenderRemindData().subscribe((result) => {
      if (result) {
        for (let item of result) {
          this._nzNotificationService.warning(
            item.title,
            item.content,
            {
              nzStyle: { background: '#ecffff' }
            }
          )
        }
      }
    });
  }

  changeCategory() {

  }

}

import { Component, OnInit, Injector } from '@angular/core';
import { Project } from 'entities';
import { NzTabChangeEvent } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'services'

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.component.html',
  styleUrls: ['./detail-project.component.less'],
})
export class DetailProjectComponent extends AppComponentBase implements OnInit {
  tabIndex: number = 0;
  project: Project = new Project();
  tenderShow: boolean = false;
  paymentplanShow: boolean = false;
  contractShow: boolean = false;
  id: any = '';
  constructor(injector: Injector, private actRouter: ActivatedRoute, private projectService: ProjectService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.getById();
  }

  voted(status: boolean) {
    if (status == true)
      this.getById();
  }

  getById() {
    this.projectService.getById(this.id).subscribe(res => {
      this.project = res;
    });
  }

  //当前激活 tab 面板变更回调函数
  change(args: NzTabChangeEvent) {
    this.tabIndex = args.index;
    switch (args.index) {
      case (0):
        break;
      case (1): this.tenderShow = true; //显示招标
        break;
      case (2): this.contractShow = true; //显示合同
        break;
      case (3): this.paymentplanShow = true; //显示回款计划
        break;
      case (4):
        break;
      case (5):
        break;
      case (6):
        break;
      default: null;
    }

  }

  //返回
  return() {
    history.back();
  }

}

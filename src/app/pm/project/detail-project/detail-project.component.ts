import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Project } from 'entities';
import { NzTabChangeEvent } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'services'
import { CreateOrUpdateProjectComponent } from '../create-or-update-project/create-or-update-project.component'

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.component.html',
  styleUrls: ['./detail-project.component.less'],
})
export class DetailProjectComponent extends AppComponentBase implements OnInit {
  // @ViewChild(CreateOrUpdateProjectComponent)
  // private projectComponent: CreateOrUpdateProjectComponent;
  tabIndex: number = 1;
  project: Project = new Project();
  url1 = '<app-tender [projectId]="id"></app-tender>';

  id: any = '';
  constructor(injector: Injector, private actRouter: ActivatedRoute, private projectService: ProjectService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
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
      case (1):
        break;
      case (2):
        break;
      case (3):
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

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
  loseOrder: string = '';
  id: any = '';
  projectId: string;
  title: string = '';
  projectTitle: string = '';
  projectStatus = ["线索", "立项", "招标", "执行"];
  constructor(injector: Injector, private actRouter: ActivatedRoute, private projectService: ProjectService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
    this.projectId = this.actRouter.snapshot.queryParams['id'];
  }

  ngOnInit() {
    if (!this.id && this.projectId)
      this.id = this.projectId;
    if (!this.id) {
      this.project.statusName = "线索";
      this.loseOrder = "线索";
      this.title = "新建项目";
    } else {
      this.title = "项目详情";
      this.getById();
    }
  }

  voted(projectId: string) {
    this.id = projectId;
    this.ngOnInit();
  }

  updateStep(statusName: string) {
    // this.loseOrder = this.project.statusName;
    let index = this.projectStatus.indexOf(this.project.statusName);
    this.projectStatus = this.projectStatus.slice(0, index + 1);
    this.projectStatus.push(statusName);
    // this.project.statusName = statusName;
    this.ngOnInit();
  }



  step(item: any) {
    console.log(item);
    let bb = item.path[0].innerText;
    if (!bb)
      bb = item.path[1].innerText;
    if (!bb)
      bb = item.path[3].innerText;
    this.loseOrder = bb;
  }

  getById() {
    this.projectService.getById(this.id).subscribe(res => {
      this.project = res;
      this.loseOrder = this.project.statusName;
      if (this.loseOrder == "已完成")
        this.projectStatus.push(this.loseOrder);
      console.log(this.loseOrder);
    });
  }

  //返回
  goBack(): void {
    history.back();
  }

}

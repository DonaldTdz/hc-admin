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
  title: string = '';
  projectTitle: string = '';
  projectStatus = ["线索", "立项", "招标", "执行"];
  constructor(injector: Injector, private actRouter: ActivatedRoute, private projectService: ProjectService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    if (!this.id) {
      this.project.statusName = "线索";
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
    this.loseOrder = this.project.statusName;
    let index = this.projectStatus.indexOf(this.project.statusName);
    this.projectStatus = this.projectStatus.slice(0, index + 1);
    this.projectStatus.push(statusName);
    this.project.statusName = statusName;
  }



  step(item: any) {
    let bb = item.path[0].innerText;
    this.project.statusName = bb;
    // if (bb == "线索" && this.project.status == 1)
    //   this.project.statusName = bb;
    // else if (bb == "立项" && this.project.status == 2)
    //   this.project.statusName = bb;
    // else if (bb == "招标" && this.project.status == 3)
    //   this.project.statusName = bb;
    // else if (bb == "执行" && this.project.status == 4)
    //   this.project.statusName = bb;
  }

  getById() {
    this.projectService.getById(this.id).subscribe(res => {
      this.project = res;
      this.loseOrder = this.project.statusName;
    });
  }

  //返回
  goBack(): void {
    history.back();
  }

}

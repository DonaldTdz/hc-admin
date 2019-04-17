import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project/project.component'
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ACLGuard } from '@delon/acl';
import { DetailProjectComponent } from './project/detail-project/detail-project.component'
import { Title } from '@angular/platform-browser';

const routes: Routes = [
  {
    path: 'project',
    component: ProjectComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: 'dprojectoc-detail',
    component: DetailProjectComponent,
    canActivate: [AppRouteGuard],
    data: { title: "项目详情" }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from '@app/home/home.component';
import { LayoutDefaultComponent } from '../layout/default/layout-default.component';
import { ACLGuard } from '@delon/acl';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [AppRouteGuard],
    canActivateChild: [AppRouteGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AppRouteGuard],
        data: { preload: true }
      },
      {
        path: 'system',
        loadChildren: './system/system.module#SystemModule',
        canActivate: [ACLGuard],
        data: { preload: true, guard: 'Administration' },
      },
      {
        path: 'wechat',
        loadChildren: './wechat/wechat.module#WechatModule',
        canActivate: [ACLGuard],
        data: { preload: true, guard: 'Admin' },
      },
      {
        path: 'talk',
        loadChildren: './talk/talk.module#TalkModule',
        canActivate: [ACLGuard],
        data: { preload: true, guard: 'Administration' },
      },
      {
        path: 'base',
        loadChildren: './base/base.module#BaseModule',
        data: { preload: true },
      },
      {
        path: 'pm',
        loadChildren: './pm/pm.module#PmModule',
        data: { preload: true },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { DetailProjectComponent } from './project/detail-project/detail-project.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { PurchaseComponent } from './purchase/purchase.component';
import { DetailPurchaseComponent } from './purchase/detail-purchase/detail-purchase.component';
import { ReimburseComponent } from './reimburse/reimburse.component';
import { DetailReimburseComponent } from './reimburse/detail-reimburse/detail-reimburse.component';
import { ModifyReimburseComponent } from './reimburse/modify-reimburse/modify-reimburse.component';
import { CreatePurchaseComponent } from './purchase/create-purchase/create-purchase.component';
import { ACLGuard } from '@delon/acl';
import { DetailComponent } from './project/detail/detail.component';
import { SaleProjectComponent } from './project/sale-project/sale-project.component';
import { SaleDetailComponent } from './project/sale-detail/sale-detail.component';
import { NewProjectComponent } from './project/new-project/new-project.component';
import { ExamineComponent } from './examine/examine.component';
import { ProjectSearchComponent } from './purchase/project-search/project-search.component';
import { WorkloadComponent } from './workload/workload.component';

const routes: Routes = [
  {
    path: 'project',
    component: ProjectComponent,
    canActivate: [AppRouteGuard, ACLGuard],
  }, {
    path: 'sale-project',
    component: SaleProjectComponent,
    canActivate: [AppRouteGuard, ACLGuard],
  }, {
    path: 'new-project',
    component: NewProjectComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { title: "创建项目" }
  },
  {
    path: 'sale-detail',
    component: SaleDetailComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { title: "销售项目详情" }
  }
  , {
    path: 'project-detail',
    component: DetailProjectComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { title: "项目详情" }
  }, {
    path: 'detail',
    component: DetailComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { title: "改版项目详情" }
  }, {
    path: 'purchase',
    component: PurchaseComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ["GeneralManager", "Finance", "Purchase"] }
  }, {
    path: 'purchase-detail',
    component: DetailPurchaseComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ["GeneralManager", "Finance", "Purchase"] }
  }, {
    path: 'reimburse',
    component: ReimburseComponent,
    canActivate: [AppRouteGuard],
  }, {
    path: 'reimburse-detail',
    component: DetailReimburseComponent,
    canActivate: [AppRouteGuard],
    data: { title: "报销详情" }
  }, {
    path: 'create-purchase',
    component: CreatePurchaseComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ["GeneralManager", "Finance", "Purchase"] }
  }, {
    path: 'create-reimburse',
    component: ModifyReimburseComponent,
    canActivate: [AppRouteGuard],
    data: { title: "新增报销" }
  },
  {
    path: 'examine',
    component: ExamineComponent,
    canActivate: [AppRouteGuard],
    data: { title: "新增报销" }
  },
  {
    path: 'workload',
    component: WorkloadComponent,
    canActivate: [AppRouteGuard],
    data: { title: "工作量统计" }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmRoutingModule { }

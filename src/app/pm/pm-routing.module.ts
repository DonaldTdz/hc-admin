import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project/project.component'
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { DetailProjectComponent } from './project/detail-project/detail-project.component'
import { TenderComponent } from './tender/tender.component'
import { PurchaseComponent } from './purchase/purchase.component'
import { DetailPurchaseComponent } from './purchase/detail-purchase/detail-purchase.component'
import { DetailTenderComponent } from './tender/detail-tender/detail-tender.component'

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
  }, {
    path: 'tender',
    component: TenderComponent,
    canActivate: [AppRouteGuard],
  }, {
    path: 'purchase',
    component: PurchaseComponent,
    canActivate: [AppRouteGuard],
  }, {
    path: 'purchase-detail',
    component: DetailPurchaseComponent,
    canActivate: [AppRouteGuard],
    data: { title: "采购详情" }
  },
  {
    path: 'tender-detail',
    component: DetailTenderComponent,
    canActivate: [AppRouteGuard],
    data: { title: " 招标详情" }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmRoutingModule { }

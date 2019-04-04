import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { CustomerComponent } from './customer/customer.component';

const routes: Routes = [
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [AppRouteGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }

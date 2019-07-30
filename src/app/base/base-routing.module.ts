import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { CustomerComponent } from './customer/customer.component';
import { CompanyComponent } from './company/company.component'
import { ProductComponent } from './product/product.component'
import { SupplierComponent } from './supplier/supplier.component'
import { DetailCustomerComponent } from './customer/detail-customer/detail-customer.component'
import { DetailSupplierComponent } from './supplier/detail-supplier/detail-supplier.component'
import { ACLGuard } from '@delon/acl';
import { group } from '@angular/animations';

const routes: Routes = [
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ["GeneralManager", "Finance", "BusinessAffairs", "Sale"] }
  },
  {
    path: 'company',
    component: CompanyComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ["GeneralManager", "Finance"] }
  }
  ,
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ["GeneralManager", "Finance", "Purchase"] }
  },
  {
    path: 'supplier',
    component: SupplierComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ["GeneralManager", "Finance", "Purchase"] }
  },
  {
    path: 'customer-detail',
    component: DetailCustomerComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ["GeneralManager", "Finance", "BusinessAffairs", "Sale"] }
  },
  {
    path: 'supplier-detail',
    component: DetailSupplierComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { guard: ["GeneralManager", "Finance", "Purchase"] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }

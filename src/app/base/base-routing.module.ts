import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { CustomerComponent } from './customer/customer.component';
import { CompanyComponent } from './company/company.component';
import { ProductComponent } from './product/product.component';
import { SupplierComponent } from './supplier/supplier.component';
import { DetailCustomerComponent } from './customer/detail-customer/detail-customer.component';
import { DetailSupplierComponent } from './supplier/detail-supplier/detail-supplier.component';
import { DetailProductComponent } from './product/detail-product/detail-product.component';


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
    data: { title: "客户详情", guard: ["GeneralManager", "Finance", "BusinessAffairs", "Sale"] }
  },
  {
    path: 'product-detail',
    component: DetailProductComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { title: "产品详情", guard: ["GeneralManager", "Finance", "Purchase"] }
  },
  {
    path: 'supplier-detail',
    component: DetailSupplierComponent,
    canActivate: [AppRouteGuard, ACLGuard],
    data: { title: "供应商详情", guard: ["GeneralManager", "Finance", "Purchase"] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }

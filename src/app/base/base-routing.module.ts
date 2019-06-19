import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { CustomerComponent } from './customer/customer.component';
import { CompanyComponent } from './company/company.component'
import { ProductComponent } from './product/product.component'
import { SupplierComponent } from './supplier/supplier.component'
import { DetailCustomerComponent } from './customer/detail-customer/detail-customer.component'
import { DetailSupplierComponent } from './supplier/detail-supplier/detail-supplier.component'

const routes: Routes = [
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: 'company',
    component: CompanyComponent,
    canActivate: [AppRouteGuard],
  }
  ,
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: 'supplier',
    component: SupplierComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: 'customer-detail',
    component: DetailCustomerComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: 'supplier-detail',
    component: DetailSupplierComponent,
    canActivate: [AppRouteGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }

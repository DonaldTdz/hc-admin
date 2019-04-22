import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectService, CustomerService, EmployeeServiceProxy, DataDictionaryService, ProjectDetailService, ProductService, TenderService, PurchaseService } from 'services'

import { PmRoutingModule } from './pm-routing.module';
import { ProjectComponent } from './project/project.component';
import { CreateOrUpdateProjectComponent } from './project/create-or-update-project/create-or-update-project.component';
import { DetailProjectComponent } from './project/detail-project/detail-project.component';
import { CreateOrUpdateProjectdetailComponent } from './project/create-or-update-projectdetail/create-or-update-projectdetail.component';
import { TenderComponent } from './tender/tender.component';
import { CreateOrUpdateTenderComponent } from './tender/create-or-update-tender/create-or-update-tender.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { CreateOrUpdatePurchaseComponent } from './purchase/create-or-update-purchase/create-or-update-purchase.component';
import { DetailPurchaseComponent } from './purchase/detail-purchase/detail-purchase.component';
import { CreateOrUpdatePurchasedetailComponent } from './purchase/create-or-update-purchasedetail/create-or-update-purchasedetail.component';
import { DetailTenderComponent } from './tender/detail-tender/detail-tender.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    ReactiveFormsModule,
    PmRoutingModule
  ],
  declarations: [
    ProjectComponent,
    CreateOrUpdateProjectComponent,
    DetailProjectComponent,
    CreateOrUpdateProjectdetailComponent,
    TenderComponent,
    CreateOrUpdateTenderComponent,
    PurchaseComponent,
    CreateOrUpdatePurchaseComponent,
    DetailPurchaseComponent,
    CreateOrUpdatePurchasedetailComponent,
    DetailTenderComponent,
  ],
  entryComponents: [
    CreateOrUpdateProjectComponent,
    DetailProjectComponent,
    CreateOrUpdateProjectdetailComponent,
    CreateOrUpdateTenderComponent,
    CreateOrUpdatePurchaseComponent,
    CreateOrUpdatePurchasedetailComponent
  ],
  providers: [ProjectService, CustomerService, EmployeeServiceProxy, DataDictionaryService, ProjectDetailService, ProductService, TenderService
    , PurchaseService]
})
export class PmModule { }

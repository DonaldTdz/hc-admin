import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@layout/layout.module';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { TalkRoutingModule } from './talk-routing.module';
import { WechatUserService } from 'services';

import { ImageCropperModule } from 'ngx-img-cropper';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        TalkRoutingModule,
        LayoutModule,
        SharedModule,
        ImageCropperModule,
    ],
    declarations: [
    ],
    entryComponents: [

    ],
    providers: [WechatUserService]
})
export class TalkModule { }

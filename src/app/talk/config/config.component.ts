import { Component, Injector } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
  PagedResultDto
} from '@shared/component-base';
import { TalkConfigService } from 'services';
import { CreateTalkConfigComponent } from '@app/talk/config/create-talk-config/create-talk-config.component'
import { EditTalkConfigComponent } from '@app/talk/config/edit-talk-config/edit-talk-config.component'
import { DingTalkConfig } from 'entities';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styles: [],
  providers: [TalkConfigService]
})
export class ConfigComponent extends PagedListingComponentBase<any> {
  constructor(injector: Injector, private configService: TalkConfigService) { super(injector); }
  configDing = [
    { value: 1, text: '公共配置', selected: true },
    { value: 2, text: '智能办公', selected: false },
  ]

  commonConfiguration: DingTalkConfig[] = [];
  commonConfigurationCount: number;
  intelligentOffice: DingTalkConfig[] = [];
  intelligentOfficeCount: number;
  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    let type;

    this.configService.getAll(request, type = 1)
      .finally(() => {
        finishedCallback();
      })
      .subscribe((result: PagedResultDto) => {
        this.commonConfiguration = result.items;
        this.commonConfigurationCount = result.totalCount;
      });


    this.configService.getAll(request, type = 2)
      .finally(() => {
        finishedCallback();
      })
      .subscribe((result: PagedResultDto) => {
        this.intelligentOffice = result.items;
        this.intelligentOfficeCount = result.totalCount;
      });
  }


  delete(entity: DingTalkConfig) {
    this.message.confirm(
      "是否确认删除该项'" + entity.typeName + "'?",
      '信息确认',
      (result: boolean) => {
        if (result) {
          this.configService.delete(entity.id).subscribe(() => {
            this.notify.success('删除成功！');
            this.refresh();
          });
        }
      }
    );
  }

  editDing(item: DingTalkConfig): void {
    this.modalHelper.open(EditTalkConfigComponent, { id: item.id }, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refresh();
      }
    });
  }
  create() {
    this.modalHelper.open(CreateTalkConfigComponent, {}, 'md', {
      nzMask: true
    }).subscribe(isSave => {
      if (isSave) {
        this.refresh();
      }
    });
  }
}

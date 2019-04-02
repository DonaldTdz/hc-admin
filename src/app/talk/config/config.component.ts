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

  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    this.configService.getAll(request)
      .finally(() => {
        finishedCallback();
      })
      .subscribe((result: PagedResultDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
        console.log(this.dataList)
      });
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

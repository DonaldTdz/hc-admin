import { Component, OnInit } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'examine',
  templateUrl: './examine.component.html',
  styles: []
})

export class ExamineComponent implements OnInit {

  listOfParentData: ParentItemData[] = [];
  listOfChildrenData: ChildrenItemData[] = [];
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: ItemData[] = [];
  listOfAllData: ItemData[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  employeeIds: string;
  employees: [{
    'text': '杨杰',
    'value': 1
  }, {
    'text': '杨帆',
    'value': 2
  }]
  constructor() { }

  ngOnInit(): void {

    this.listOfParentData.push({
      key: 0,
      name: '杨杰',
      platform: '员工',
      status: false,
      upgradeNum: 500,
      creator: '￥ 300.00',
      createdAt: '2020-01-12 23:12:00',
      expand: false
    });

    this.listOfParentData.push({
      key: 1,
      name: '杨帆',
      platform: '员工',
      status: false,
      upgradeNum: 500,
      creator: '￥ 300.00',
      createdAt: '2020-01-12 23:12:00',
      expand: false
    });



    this.listOfChildrenData.push({
      key: 1,
      date: '2020-01-12 23:12:00',
      name: '',
      upgradeNum: 'Upgraded: 56',
      kinds: '交通费',
      pro: '深圳条烟追溯系统',
      detail: '滴滴打车费用',
      total: 150
    });
    this.listOfChildrenData.push({
      key: 2,
      date: '2020-01-12 23:12:00',
      name: '',
      upgradeNum: 'Upgraded: 56',
      kinds: '伙食',
      pro: '深圳条烟追溯系统',
      detail: '每日食补',
      total: 150
    });




  }

  currentPageDataChange($event: ItemData[]): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
}
interface ParentItemData {
  key: number;
  name: string;
  platform: string;
  status: boolean;
  upgradeNum: number | string;
  creator: string;
  createdAt: string;
  expand: boolean;
}

interface ChildrenItemData {
  key: number;
  name: string;
  date: string;
  upgradeNum: string;
  kinds: string;
  pro: string;
  detail: string;
  total: number;
}

interface ItemData {
  id: number;
  name: string;
  age: number;
  address: string;
}

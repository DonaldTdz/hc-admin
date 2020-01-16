import { Component, OnInit, Injector } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'project-search',
  templateUrl: './project-search.component.html',
  styleUrls: ['./project-search.component.scss'],
})
export class ProjectSearchComponent extends ModalComponentBase implements OnInit {

  form: FormGroup;
  constructor(injector: Injector, private fb: FormBuilder, ) {
    super(injector);

  }
  selectValue = "已投标";
  ngOnInit() {
    this.form = this.fb.group({
      totalAmount: [null],
      taxAmount: [null],
    })
  }
  dataSet = [
    {
      key: '1',
      name: '杨杰',
      pro: "条烟品牌追溯系统",
      date: '2020-01-02 02:02:33'
    },
    {
      key: '2',
      name: '杨帆',
      pro: "UPS电池系统",
      date: '2020-01-02 02:02:33'
    },
  ];

  saves(name: string) {
    this.close();
  }

  save() {

  }

}

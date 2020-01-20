import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { V } from '@angular/core/src/render3';

@Component({
  selector: 'workload',
  templateUrl: './workload.component.html',
  styles: []
})
export class WorkloadComponent implements OnInit {
  isAddVisible = false;
  validateForm: FormGroup;
  nowPro = '';//当前项目
  dataSet = [
    {
      id: '1',
      kind: '上位机',
      modular: '主界面',
      function: '二维码识别控制',
      describe: '',
      workload: 3,
      remark: ''
    },
    {
      id: '2',
      kind: '上位机',
      modular: '配置管理',
      function: '配置管理',
      describe: '',
      workload: 3,
      remark: ''
    },
    {
      id: '3',
      kind: '后台管理',
      modular: '抓拍查询',
      function: '抓拍查询',
      describe: '',
      workload: 5,
      remark: ''
    },
    {
      id: '4',
      kind: '后台管理',
      modular: '条件查询',
      function: '条件查询',
      describe: '',
      workload: 5,
      remark: ''
    },
    {
      id: '5',
      kind: '手机App',
      modular: '扫码查询',
      function: '扫码查询',
      describe: '',
      workload: 5,
      remark: ''
    },
    {
      id: '6',
      kind: '手机App',
      modular: '条件查询',
      function: '条件查询',
      describe: '',
      workload: 5,
      remark: ''
    }
  ];

  dataSetList = [
    {
      id: '1',
      kind: '现场实施',
      modular: '现场实施',
      function: '现场实施',
      describe: '',
      workload: 25,
      remark: '平均每条线5天'
    }
  ];
  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      select: [null, Validators.required],
      kind: [null, [Validators.required]],
      modular: [null, [Validators.required]],
      function: [null, [Validators.required]],
      describe: [null, [Validators.required]],
      workload: [null, [Validators.required]],
      remark: [null, [Validators.required]]
    });
  }

  show(name: string) {
    this.nowPro = name;
  }

  //  添加新的工作量
  addWorkload() {
    this.isAddVisible = true;
  }

  //展示新增狂
  cancel() {
    this.isAddVisible = false;
  }
  //取消新增框
  sure() {
    console.log(this.validateForm.value)
    var newData = this.validateForm.value;

    switch (newData.select) {
      case 'dev': this.dataSet.push(newData);
      case 'imp': this.dataSetList.push(newData);
    }
    this.isAddVisible = false;
  }
  //删除条目
  del(id: string) {

    const dataSet = this.dataSet.filter(d => d.id !== id);
    this.dataSet = dataSet;
    console.log(this.dataSet)
  }
  delss
    (id: string) {
    const dataSetList = this.dataSetList.filter(d => d.id !== id);
    this.dataSetList = dataSetList;
  }
  //更新条目
  updateEditCache(): void {

  }

  //调教
  submitForm() {
    console.log(this.validateForm.value)
  }
}

import { Component, OnInit, Injector, Input } from '@angular/core';
import { Reimburse } from 'entities'
import { AppComponentBase } from '@shared/app-component-base';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProjectService } from 'services'

@Component({
  selector: 'app-modify-reimburse',
  templateUrl: './modify-reimburse.component.html',
  styles: []
})
export class ModifyReimburseComponent extends AppComponentBase implements OnInit {
  @Input() reimburseId;
  reimburse: Reimburse = new Reimburse();
  form: FormGroup;
  projects = [];

  reimburseType = [{ text: "项目型报销", value: 1 }, { text: "非项目报销", value: 2 }];
  constructor(injector: Injector, private fb: FormBuilder, private projectService: ProjectService) {
    super(injector);
  }

  ngOnInit() {
    this.form = this.fb.group({
      projectId: [null],
      amount: [null, Validators.compose([Validators.maxLength(18), Validators.required])],
      type: [null, Validators.compose([Validators.required])],
      remark: [null],
      submitDate: [null, Validators.compose([Validators.required])]
    });
    if (this.reimburse) {

    } else {
      this.reimburse.type = 1;
    }
  }

  getProjects() {
    this.projectService.getDropDownDtos().subscribe((result) => {
      this.projects = result;
    })
  }

}

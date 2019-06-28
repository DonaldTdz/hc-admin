import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataDictionary } from 'entities'
import { DataDictionaryService } from 'services'

@Component({
  selector: 'app-create-tenderdata',
  templateUrl: './create-tenderdata.component.html',
  styleUrls: ['../tender.component.scss']
})
export class CreateTenderDataComponent extends ModalComponentBase implements OnInit {
  form: FormGroup;
  dataDictionary: DataDictionary = new DataDictionary();
  constructor(injector: Injector, private dataDictionaryService: DataDictionaryService, private fb: FormBuilder
  ) { super(injector); }

  ngOnInit() {
    this.form = this.fb.group({
      value: [null, Validators.compose([Validators.required, Validators.maxLength(25)])],
    });
  }

  save() {
    this.dataDictionary.group = 6;
    this.dataDictionary.code = this.dataDictionary.value;
    this.dataDictionaryService.createOrUpdate(this.dataDictionary).finally(() => {
      this.saving = false;
    }).subscribe(() => {
      this.notify.success('保存成功！');
      this.success({ 'value': this.dataDictionary.value, 'status': '1' }); //status=1 为公用
    });
  }

  savaRepository() {
    this.notify.success('保存成功！');
    this.success({ 'value': this.dataDictionary.value, 'status': '2' });//status=2 为私用
  }

}

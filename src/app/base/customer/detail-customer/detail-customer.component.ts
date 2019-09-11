import { Component, OnInit, Injector } from '@angular/core';
import { CustomerService, ProjectService } from 'services';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'entities'
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail-customer',
  templateUrl: './detail-customer.component.html',
  styleUrls: ['./detail-customer.component.scss']
})
export class DetailCustomerComponent extends AppComponentBase implements OnInit {
  id: any = '';
  title: string = '';
  form: FormGroup;
  tableLoading = "false";
  customer: Customer = new Customer();
  customerTypes = [
    { value: 1, text: '企业' },
    { value: 2, text: '个人' },
    { value: 3, text: '其他' },
  ];
  constructor(injector: Injector, private fb: FormBuilder, private customerService: CustomerService, private actRouter: ActivatedRoute, private projectService: ProjectService) {
    super(injector);
    this.id = this.actRouter.snapshot.params['id'];
  }

  ngOnInit() {
    this.customer.type = 1;
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(50)])], //客户名称
      type: [null], //客户类型
      address: [null, Validators.compose([Validators.maxLength(250)])], //地址
      zipCode: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9 ]{3,12}$')]),], //邮编
      tel: [null, Validators.compose([Validators.pattern('(\\+\\d+)?1[34578]\\d{9}$')]),], //电话
      remark: [null, Validators.compose([Validators.maxLength(250)])], //备注
    });
    if (this.id) {
      this.title = '编辑客户';
      this.getById();
      this.getProjects();
    } else {
      this.title = '新增客户';
    }
  }


  getById() {
    this.customerService.getById(this.id).subscribe(res => {
      this.customer = res;
    });
  }

  //保存
  save() {
    this.customerService.createOrUpdate(this.customer)
      .subscribe((result: any) => {
        if (result.code == 0) {
          this.notify.error(result.msg);
        } else {
          this.id = result.data.id;
          this.notify.success(result.msg);
        }
      });
  }

  //查询
  getProjects() {
    this.tableLoading = "true"
    let params: any = {};
    params.SkipCount = this.query.skipCount();
    params.MaxResultCount = this.query.pageSize;
    params.CustomerId = this.id;
    this.projectService.getAll(params).subscribe((result: PagedResultDto) => {
      this.tableLoading = "false";
      this.query.dataList = result.items;
      this.query.total = result.totalCount;
    })
  }

  //返回
  goBack() {
    history.back();
  }

}

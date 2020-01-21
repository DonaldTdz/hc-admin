import { Component, OnInit, Injector } from '@angular/core';
import { Project } from 'entities';
import { ProjectService, CustomerService } from 'services'
import { AppComponentBase } from '@shared/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { PagedResultDto } from '@shared/component-base/paged-listing-component-base';

var nowDate = new Date();

@Component({
    selector: 'cw-project',
    templateUrl: './cw-project.component.html',
    styles: []
})
export class CWProjectComponent extends AppComponentBase implements OnInit {
    projectMode = [{ text: "内部", value: 1 }, { text: "合伙", value: 2 }, { text: "外部", value: 3 }];
    projectStatus = [{ text: "立项", value: 2 }
        , { text: "招标", value: 3 }
        , { text: "执行", value: 4 }
        , { text: "丢单", value: 5 }];
    search: any = {};
    customerList: any;
    expandForm = false;
    shedateFormat = 'yyyy-MM-dd';
    id: any = '';
    project: Project = new Project();
    loading = "false"
    constructor(injector: Injector, private router: Router, private projectService: ProjectService, private customerService: CustomerService, private actRouter: ActivatedRoute) {
        super(injector);
        this.id = this.actRouter.snapshot.queryParams['id'];
    }

    ngOnInit() {
        this.search.createDate = [new Date(nowDate.getFullYear(), 0, 1)
            , new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate())]
        this.getProjects();
        this.getCustomerList();
    }

    //查询
    getProjects() {
        //this.loading = "true"
        let params: any = {};
        params.SkipCount = this.query.skipCount();
        params.MaxResultCount = this.query.pageSize;
        params.Name = this.search.name;
        params.Status = this.search.status;
        params.customerId = this.search.customerId;
        params.projectCode = this.search.projectCode;
        params.startDate = this.search.createDate[0];
        params.endDate = this.search.createDate[1];
        params.Id = this.id;

        /*this.projectService.getAll(params).subscribe((result: PagedResultDto) => {
            this.loading = "false"
            this.query.dataList = result.items;
            this.query.total = result.totalCount;
        })*/

        this.query.dataList = [
            { id: 2, projectCode: 'HC-X-20200116', name: '卷烟分拣品牌追溯系统', modeName: '合作', customerName: '深圳烟草', projectSalesName: '黄坚迎', status: 2, budget: '¥ 200,000.00' },
            { id: 3, projectCode: 'HC-X-20200117', name: '异型烟辅助系统', modeName: '合作', customerName: '汕头烟草', projectSalesName: '黄坚迎', status: 4, budget: '¥ 50,000.00' },
            { id: 4, projectCode: 'HC-X-20200118', name: '广元标准化平台', modeName: '内部', customerName: '广元烟草', projectSalesName: '吴呈和', status: 5, budget: '¥ 250,000.00' }
        ];
        this.query.total = 3;
    }

    getCustomerList() {
        this.customerService.getDropDownDtos().subscribe((result) => {
            this.customerList = result;
        });
    }

    //详细
    details(id: any) {
        this.router.navigate(['/app/pm/sale-detail', { id: id, role: 'cw' }]);
    }

    //新增
    create() {
        this.router.navigate(['/app/pm/new-project']);
    }

    //删除
    delete(entity: Project) {
        this.message.confirm(
            "是否删除该项目:'" + entity.name + "'?(请谨慎删除,如该项目下面有其他功能正在使用,可能会出现无法正常使用的情况)",
            "信息确认",
            (result: boolean) => {
                if (result) {
                    this.projectService.delete(entity.id).subscribe(() => {
                        this.notify.success('删除成功！');
                        this.getProjects();
                    });
                }
            }
        )
    }

    //重置
    refreshData() {
        this.search = {};
        this.search.createDate = [new Date(nowDate.getFullYear(), 0, 1)
            , new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate())]
        this.query.pageIndex = 1;
        this.getProjects();
    }

}
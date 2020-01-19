import { Component, OnInit, Injector } from '@angular/core';
import { Project } from 'entities';
import { NzTabChangeEvent } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'services'
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-sale-detail',
    templateUrl: './sale-detail.component.html',
    styleUrls: ['./sale-detail.component.less'],
})
export class SaleDetailComponent extends AppComponentBase implements OnInit {
    tabIndex: number = 0;
    project: Project = new Project();
    loseOrder: string = '';
    id: any = '';
    projectId: string;
    title: string = '';
    projectTitle: string = '';
    projectStatus = ["线索", "立项", "招标", "执行"];
    costdetails = [{ type: '硬件', name: '工控机', num: 1, unit: '套', price: '¥ 10,000.00', total: '¥ 10,000.00' },
    { type: '硬件', name: '扫码头', num: 2, unit: '套', price: '¥ 3,000.00', total: '¥ 6,000.00' },
    { type: '软件', name: '包装箱追溯系统', num: 51, unit: '人/天', price: '¥ 800.00', total: '¥ 40,800.00' },
    { type: '软件', name: 'App开发平台', num: 1, unit: '会员', price: '¥ 3,600.00', total: '¥ 3,600.00' },
    { type: '实施', name: '实施费用', num: 1, unit: '套', price: '¥ 20,000.00', total: '¥ 20,000.00' },
    { type: '总计', name: '', num: null, unit: '', price: '', total: '¥ 80,400.00' }];
    pdetails = [{ type: '硬件', name: '工控机', gys: '研华科技（中国）有限公司版权所有', gg: 'TPC-1581WP', config: 'CPU:i5 2核 内存：8G 操作系统：Win 7 x64 SP1', num: 1, unit: '套', price: '¥ 10,000.00', total: '¥ 10,000.00' },
    { type: '硬件', name: '扫码头', gys: '康耐视视觉检测系统（上海）有限公司', gg: 'DMR-262Q', config: '二维码读码器套件（含光源、镜头）', num: 2, unit: '套', price: '¥ 3,000.00', total: '¥ 6,000.00' },
    { type: '软件', name: 'App开发平台', gys: '智慧神州(北京)科技有限公司', gg: 'V1', config: '会员V1', num: 1, unit: '会员', price: '¥ 3,600.00', total: '¥ 3,600.00' },
    { type: '总计', name: '', gys: '', gg: '', config: '', num: null, unit: '', price: '', total: '¥ 19,600.00' }];
    fpdetails = [{ no: '202001', amount: '¥ 50,000.00', date: '2020-01-01', remark: '签订合同' },
    { no: '202002', amount: '¥ 50,000.00', date: '2020-01-31', remark: '初验' },
    { no: '总计', amount: '¥ 100,000.00', date: '', remark: '' }];
    hkdetails = [{ plandate: '2020-01-01', rate: '33.33%', amount: '¥ 50,000.00', date: '2020-01-01', status: '1', remark: '签订合同' },
    { plandate: '2020-01-31', rate: '33.33%', amount: '¥ 50,000.00', date: '2020-01-31', status: '1', remark: '初验' },
    { plandate: '2020-03-31', rate: '33.33%', amount: '¥ 50,000.00', date: '', status: '0', remark: '' }];
    rgdetails = [{ name: '黄坚迎', leve: '项目经理', daynum: '15', date: '2020-01-31' },
    { name: '王邦涛', leve: '实施工程师', daynum: '15', date: '2020-01-31' },
    { name: '赵聪霖', leve: '软件工程师', daynum: '15', date: '2020-01-31' },
    { name: '总计', leve: '', daynum: '45', date: '' }];
    bxdetails = [{
        type: '交通费用', name: '全部', leve: '1', amount: '¥ 1,200.00', date: '-', remark: '', expand: false, details: [
            { type: '交通费用', name: '黄坚迎', leve: '2', amount: '¥ 600.00', date: '2020-01-15', remark: '机票深圳到成都', expand: false },
            { type: '交通费用', name: '王邦涛', leve: '2', amount: '¥ 300.00', date: '2020-01-18', remark: '高铁深圳到广州', expand: false },
            { type: '交通费用', name: '赵聪霖', leve: '2', amount: '¥ 300.00', date: '2020-01-18', remark: '高铁深圳到广州', expand: false }
        ]
    },
    {
        type: '酒店费', name: '全部', leve: '1', amount: '¥ 6,000.00', date: '-', remark: '', expand: false, details: [
            { type: '酒店费', name: '黄坚迎', leve: '2', amount: '¥ 1,000.00', date: '2020-01-15', remark: '深圳酒店5晚*200', expand: false },
            { type: '酒店费', name: '王邦涛', leve: '2', amount: '¥ 5,000.00', date: '2020-01-18', remark: '我和小赵两人深圳酒店10晚*500', expand: false }
        ]
    },
    {
        type: '餐饮补助', name: '全部', leve: '1', amount: '¥ 1,500.00', date: '-', remark: '', expand: false, details: [
            { type: '餐饮补助', name: '王邦涛', leve: '2', amount: '¥ 700.00', date: '2020-01-15', remark: '综合补助', expand: false },
            { type: '餐饮补助', name: '赵聪霖', leve: '2', amount: '¥ 800.00', date: '2020-01-18', remark: '综合补助', expand: false }
        ]
    },
    { type: '总计', name: '', leve: '1', amount: '¥ 8,700.00', date: '', remark: '', expand: false }];
    cbdetails = [{ name: '采购费用', amount: '¥ 19,600.00', remark: '' },
    { name: '人工费用', amount: '¥ 36,000.00', remark: '单价800*45天' },
    { name: '实施费用', amount: '¥ 20,000.00', remark: '' },
    { name: '报销', amount: '¥ 8,700.00', remark: '' },
    { name: '税费', amount: '¥ 1,500.00', remark: '' },
    { name: '总计', amount: '¥ 85,800.00', remark: '' }];

    ssdetails = [{ id: '1', level: '实施工程师', gotime: ' 2020-01-01', workeday: '10', price: '¥ 1,500.00', total: '¥ 15,000.00', remark: '计划李志强' },
    { id: '2', level: '实施工程师', gotime: ' 2020-01-01', workeday: '5', price: '¥ 1,000.00', total: '¥ 5,000.00', remark: '计划赵聪霖' }//,
        //{ id: '-1', level: '总计', gotime: ' ', workeday: '15', price: '', total: '¥ 20,000.00', remark: '' }
    ];

    editCache: { [key: string]: { edit: boolean; data: any } } = {};

    form: FormGroup;

    status1: ProjectStatus = new ProjectStatus();
    status2: ProjectStatus = new ProjectStatus();
    status3: ProjectStatus = new ProjectStatus();
    status4: ProjectStatus = new ProjectStatus();
    role: string;

    constructor(injector: Injector, private actRouter: ActivatedRoute, private router: Router, private projectService: ProjectService, private fb: FormBuilder) {
        super(injector);
        this.id = this.actRouter.snapshot.params['id'];
        this.role = this.actRouter.snapshot.params['role'];
        this.projectId = this.actRouter.snapshot.queryParams['id'];
        this.form = this.fb.group({
            projectname: '',
            customername: '',
            customercontact: '',
            profitratio: '',
            projectdate: '',
            projectdesc: '',
            salepron: '',
            projectmode: '',
            projecttype: ''
        });
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    cancelEdit(id: string): void {
        const index = this.ssdetails.findIndex(item => item.id === id);
        this.editCache[id] = {
            data: { ...this.ssdetails[index] },
            edit: false
        };
    }

    saveEdit(id: string): void {
        const index = this.ssdetails.findIndex(item => item.id === id);
        Object.assign(this.ssdetails[index], this.editCache[id].data);
        this.editCache[id].edit = false;
    }

    updateEditCache(): void {
        this.ssdetails.forEach(item => {
            if (item.id == '0') {
                this.editCache[item.id] = {
                    edit: true,
                    data: { ...item }
                };
            } else {
                this.editCache[item.id] = {
                    edit: false,
                    data: { ...item }
                };
            }
        });
    }


    ngOnInit() {
        /*if (!this.id && this.projectId)
            this.id = this.projectId;
        if (!this.id) {
            this.project.statusName = "线索";
            this.loseOrder = "线索";
            this.title = "新建项目";
        } else {
            this.title = "改版项目详情";
            this.getById();
        }*/
        this.RefreshStatus();
        this.updateEditCache();
    }

    clx() {
        this.id = '2';
        this.RefreshStatus();
    }

    czx() {
        this.id = '3';
        this.RefreshStatus();
    }

    cwc() {
        this.id = '4';
        this.RefreshStatus();
    }

    RefreshStatus() {
        if (this.id == '1') {//线索
            this.status1.color = 'blue';
            this.status1.title = '线索 黄坚迎 2019-06-01';
            this.status2.color = 'green';
            this.status2.title = '立项';
            this.status3.color = 'gray';
            this.status3.title = '执行';
            this.status4.color = 'gray';
            this.status4.title = '完成';
        }
        if (this.id == '2') {//立项
            this.status1.color = 'blue';
            this.status1.title = '线索 黄坚迎 2019-06-01';
            this.status2.color = 'blue';
            this.status2.title = '立项 黄坚迎 2019-01-01';
            this.status3.color = 'green';
            this.status3.title = '执行';
            this.status4.color = 'gray';
            this.status4.title = '完成';
        }
        if (this.id == '3') {//执行
            this.status1.color = 'blue';
            this.status1.title = '线索 黄坚迎 2019-06-01';
            this.status2.color = 'blue';
            this.status2.title = '立项 黄坚迎 2019-01-01';
            this.status3.color = 'blue';
            this.status3.title = '执行 代荣莉 2019-01-06';
            this.status4.color = 'green';
            this.status4.title = '完成';
        }
        if (this.id == '4') {//完成
            this.status1.color = 'blue';
            this.status1.title = '线索 黄坚迎 2019-06-01';
            this.status2.color = 'blue';
            this.status2.title = '立项 黄坚迎 2019-01-01';
            this.status3.color = 'blue';
            this.status3.title = '执行 代荣莉 2019-01-06';
            this.status4.color = 'blue';
            this.status4.title = '完成 代荣莉 2019-01-31';
        }
    }

    voted(projectId: string) {
        this.id = projectId;
        this.ngOnInit();
    }

    toEdit() {
        this.router.navigate(['/app/pm/new-project', { id: '1' }]);
    }

    updateStep(statusName: string) {
        let index = this.projectStatus.indexOf(this.project.statusName);
        this.projectStatus = this.projectStatus.slice(0, index + 1);
        this.projectStatus.push(statusName);
        this.ngOnInit();
    }



    step(item: any) {
        console.log(item);
        let bb = item.path[0].innerText;
        if (!bb)
            bb = item.path[1].innerText;
        if (!bb)
            bb = item.path[3].innerText;
        this.loseOrder = bb;
    }

    getById() {
        this.projectService.getById(this.id).subscribe(res => {
            this.project = res;
            this.loseOrder = this.project.statusName;
            if (this.loseOrder == "已完成")
                this.projectStatus.push(this.loseOrder);
            console.log(this.loseOrder);
        });
    }

    //返回
    goBack(): void {
        history.back();
    }

    addNewSale(): void {
        this.ssdetails.push({ id: '0', level: '', gotime: '', workeday: '', price: '', total: '', remark: '' });
        this.updateEditCache();
    }

    copySale(row: any): void {
        let copyRow = JSON.parse(JSON.stringify(row));
        copyRow.id = '0';
        this.ssdetails.push(copyRow);
        this.updateEditCache();
    }

}

export class ProjectStatus {
    constructor() {

    }
    color: string;
    title: string;
}

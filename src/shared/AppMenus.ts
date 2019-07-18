import { Menu } from '@delon/theme';
import { type } from 'os';

// 全局的左侧导航菜单
export class AppMenus {
    // new
    static Menus: Menu[] = [
        {
            text: "主页",// 无本地化显示字符
            //i18n: "HomePage",// 本地化主键(ABP本地化)
            acl: "",// 权限
            icon: { type: "icon", value: "home" },// 图标
            link: "/app/home", // url 地址
            // hide: true,  // 强制隐藏
            // ...还有更多选项，请查看 Menu成员
        },
        {
            text: "微信配置",
            icon: { type: "icon", value: "wechat" },
            link: "/app/wechat/config",
            acl: "Admin",
            reuse: false
        },
        {
            text: "钉钉管理",
            icon: { type: "icon", value: "dingding" },
            link: "/app/talk",
            group: true,
            acl: "Administration",// 权限
            children: [
                {
                    text: "组织架构",
                    link: "/app/talk/organization",
                    reuse: false
                },
                {
                    text: "钉钉配置",
                    link: "/app/talk/config",
                    reuse: false
                }
            ]
        },
        {
            text: "基础数据",
            icon: { type: "icon", value: "bars" },
            link: "/app/base",
            // acl: "role: [ 'SaleBusiness','CompanyAdmin','Purchase' ]",  //SaleBusiness,CompanyAdmin,Purchase"
            group: true,
            children: [
                {
                    text: "客户管理",
                    link: "/app/base/customer",
                    acl: "SaleBusiness",
                    reuse: false
                },
                {
                    text: "公司管理",
                    link: "/app/base/company",
                    acl: "CompanyAdmin",
                    reuse: false
                },
                {
                    text: "产品管理",
                    link: "/app/base/product",
                    acl: "Purchase",
                    reuse: false
                },
                {
                    text: "供应商管理",
                    link: "/app/base/supplier",
                    acl: "Purchase",
                    reuse: false
                },
            ]
        },
        {
            text: "项目管理",
            icon: { type: "icon", value: "project" },
            link: "/app/pm",
            group: true,
            children: [
                {
                    text: "项目",
                    link: "/app/pm/project",
                    reuse: false
                }, {
                    text: "采购",
                    link: "/app/pm/purchase",
                    acl: "Purchase",
                    reuse: false
                }, {
                    text: "报销",
                    link: "/app/pm/reimburse",
                    reuse: false
                }//, {
                //     text: "工时查询",
                //     link: "/app/pm/timesheet",
                //     reuse: false
                // }
                // {
                //     text: "招标管理",
                //     link: "/app/pm/tender",
                //     reuse: false
                // }, {
                //     text: "合同管理",
                //     link: "/app/pm/contract",
                //     reuse: false
                // }, {
                //     text: "发票管理",
                //     link: "/app/pm/invoice",
                //     reuse: false
                // }
            ]
        },
        {
            text: "系统管理",
            icon: { type: "icon", value: "setting" },
            link: "/app/system",
            acl: "Administration",// 权限
            group: true,
            children: [
                {
                    text: "用户管理",
                    link: "/app/system/users",
                    reuse: false
                },
                {
                    text: "角色管理",
                    link: "/app/system/roles",
                    reuse: false
                },
                {
                    text: "数据字典",
                    link: "/app/system/datadictionary",
                    reuse: false
                },
            ]
        }
    ];
}
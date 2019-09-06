import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { PagedResultDto, PagedResultNewDto } from "@shared/component-base";

@Injectable()
export class ReportServices {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }

    /**
* 获取发票分类统计数据
*/
    getInvoiceStatistics(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/InvoiceStatistics/GetInvoiceStatisticsAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultDto();
            result.items = data.items;
            result.totalCount = data.totalCount;
            return result;
        }));
    }

    /**
* 获取应收账款
*/
    getAccountsReceivable(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/AccountsReceivable/GetAccountsReceivableAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultDto();
            result.items = data.items;
            result.totalCount = data.totalCount;
            return result;
        }));
    }

    /**
* 获取客户应收账款明细
*/
    getCustomerReceivablesDetail(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/AccountsReceivable/GetCustomerReceivablesDetailAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultDto();
            result.items = data.items;
            result.totalCount = data.totalCount;
            return result;
        }));
    }

    /**
* 获取年利润合计
*/
    getProfitStatistics(params: any): Observable<any[]> {
        let url_ = "/api/services/app/ProfitStatistic/GetProfitStatisticAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            return data;
        }));
    }

    /**
* 获取应付账款
*/
    getAccountsPayable(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/AccountsPayable/GetAccountsPayableAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultDto();
            result.items = data.items;
            result.totalCount = data.totalCount;
            return result;
        }));
    }

    /**
    * 获取客户应付账款明细
    */
    getSupplierPayableDetail(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/AccountsPayable/GetSupplierPayableDetailAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultDto();
            result.items = data.items;
            result.totalCount = data.totalCount;
            return result;
        }));
    }


    /**
* 获取年销售合计
*/
    getSalesDetails(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/SalesDetail/GetSalesDetailPagedAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultDto();
            result.items = data.items;
            result.totalCount = data.totalCount;
            return result;
        }));
    }

    /**
* 获取单个项目利润明细
*/
    getProjectProfitById(params: any): Observable<any> {
        let url_ = "/api/services/app/ProjectProfitReport/GetProjectProfitByIdAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            return data;
        }));
    }

    /**
* 获取账款统计
*/
    getAccountAnalysesAsync(params: any): Observable<PagedResultNewDto<any>> {
        let url_ = "/api/services/app/AccountAnalysis/GetAccountAnalysesAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultNewDto();
            result.items = data.accountAnalyses;
            result.common = data.planTimes;
            return result;
        }));
    }

}

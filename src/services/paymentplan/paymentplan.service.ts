import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { PaymentPlan } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class PaymentPlanService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/PaymentPlan/GetPagedAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultDto();
            result.items = data.items;
            result.totalCount = data.totalCount;
            return result;
        }));
    }


    /**
* 获取单条数据详细信息
* @param id 
*/
    getById(id: any): Observable<PaymentPlan> {
        let _url = "/api/services/app/PaymentPlan/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return PaymentPlan.fromJS(data);
        }));
    }

    /**
* 获取编辑PaymentPlan
* @param id 
*/
    getForEdit(id: any): Observable<PaymentPlan> {
        let _url = "/api/services/app/PaymentPlan/GetForEditAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return PaymentPlan.fromJS(data.PaymentPlan);
        }));
    }


    /**
     * 更新与创建回款计划
     * @param input 
     */
    createOrUpdate(input: PaymentPlan | null): Observable<PaymentPlan> {
        let _url = "/api/services/app/PaymentPlan/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "PaymentPlan": input }).pipe(map(data => {
            return PaymentPlan.fromJS(data);;
        }))
    }


    /**
     * 删除回款计划
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/PaymentPlan/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

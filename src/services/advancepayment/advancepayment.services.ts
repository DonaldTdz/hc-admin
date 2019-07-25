import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { PagedResultDto } from "@shared/component-base";
import { AdvancePayment } from 'entities'

@Injectable()
export class AdvancePaymentService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }

    /**
  * 获取分页数据
  */
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/AdvancePayment/GetPagedAsync";
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
    getById(id: any): Observable<AdvancePayment> {
        let _url = "/api/services/app/AdvancePayment/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return AdvancePayment.fromJS(data);
        }));
    }

    /**
* 获取编辑预付款计划
* @param id 
*/
    getForEdit(id: any): Observable<AdvancePayment> {
        let _url = "/api/services/app/AdvancePayment/GetForEditAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return AdvancePayment.fromJS(data.AdvancePayment);
        }));
    }

    /**
     * 更新与创建预付款计划
     * @param input 
     */
    createOrUpdate(input: AdvancePayment | null): Observable<AdvancePayment> {
        let _url = "/api/services/app/AdvancePayment/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "AdvancePayment": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除预付款计划
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/AdvancePayment/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

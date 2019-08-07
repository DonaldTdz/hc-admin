import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { PagedResultDto } from "@shared/component-base";
import { AdvancePaymentDetail } from 'entities'

@Injectable()
export class AdvancePaymentDetailService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }

    /**
  * 获取分页数据
  */
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/AdvancePaymentDetail/GetPagedAsync";
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
    getById(id: any): Observable<AdvancePaymentDetail> {
        let _url = "/api/services/app/AdvancePaymentDetail/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return AdvancePaymentDetail.fromJS(data);
        }));
    }

    /**
* 获取编辑预付款计划详情
* @param id 
*/
    getForEdit(id: any): Observable<AdvancePaymentDetail> {
        let _url = "/api/services/app/AdvancePaymentDetail/GetForEditAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return AdvancePaymentDetail.fromJS(data.AdvancePaymentDetail);
        }));
    }

    /**
     * 更新与创建预付款计划详情
     * @param input 
     */
    createOrUpdate(input: AdvancePaymentDetail | null): Observable<AdvancePaymentDetail> {
        let _url = "/api/services/app/AdvancePaymentDetail/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "AdvancePaymentDetail": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除预付款计划详情
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/AdvancePaymentDetail/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

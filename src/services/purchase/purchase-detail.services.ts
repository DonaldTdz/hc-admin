import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { PurchaseDetail } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class PurchaseDetailService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/PurchaseDetail/GetPagedAsync";
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
    getById(id: any): Observable<PurchaseDetail> {
        let _url = "/api/services/app/PurchaseDetail/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return PurchaseDetail.fromJS(data);
        }));
    }



    /**
     * 根据采购id获取采购明细下拉列表
     * @param projectId 
     */
    GetDropDownsByPurchaseId(purchaseId: any): Observable<any> {
        let _url = "/api/services/app/PurchaseDetail/GetDropDownsByPurchaseIdAsync";
        return this._commonhttp.get(_url, { purchaseId: purchaseId }).pipe(map(data => {
            return data;
        }));
    }


    /**
* 获取编辑PurchaseDetail
* @param id 
*/
    getForEdit(id: any): Observable<PurchaseDetail> {
        let _url = "/api/services/app/PurchaseDetail/GetForEditAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return PurchaseDetail.fromJS(data.PurchaseDetail);
        }));
    }

    /**
     * 更新与创建采购详细
     * @param input 
     */
    createOrUpdate(input: PurchaseDetail | null): Observable<PurchaseDetail> {
        let _url = "/api/services/app/PurchaseDetail/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "PurchaseDetail": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除采购详细
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/PurchaseDetail/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

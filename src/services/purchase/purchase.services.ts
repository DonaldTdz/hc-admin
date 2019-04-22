import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { Purchase } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class PurchaseService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/Purchase/GetPagedAsync";
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
    getById(id: any): Observable<Purchase> {
        let _url = "/api/services/app/Purchase/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Purchase.fromJS(data);
        }));
    }

    /**
* 获取编辑Purchase
* @param id 
*/
    getForEdit(id: any): Observable<Purchase> {
        let _url = "/api/services/app/Purchase/GetForEditAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Purchase.fromJS(data.Purchase);
        }));
    }

    /**
     * 更新与创建采购
     * @param input 
     */
    createOrUpdate(input: Purchase | null): Observable<Purchase> {
        let _url = "/api/services/app/Purchase/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "Purchase": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除采购
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/Purchase/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

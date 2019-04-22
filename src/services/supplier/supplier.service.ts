import { Inject, Optional, Injectable } from "@angular/core";
import { Observer, Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map, count } from "rxjs/operators";
import { Supplier } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class SupplierService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/Supplier/GetPagedAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultDto();
            result.items = data.items;
            result.totalCount = data.totalCount;
            return result;
        }));
    }
    /**
 * 获取单条数据
 * @param id 
 */
    GetById(id: string): Observable<Supplier> {
        let _url = "/api/services/app/Supplier/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Supplier.fromJS(data);
        }));
    }

    /**
* 获取供应商下拉列表
*/
    getDropDownDtos(): Observable<any> {
        let _url = "/api/services/app/Supplier/GetDropDownsAsync";
        return this._commonhttp.get(_url).pipe(map(data => {
            return data;
        }));
    }

    /**
     * 更新与创建产品
     * @param input 
     */
    createOrUpdate(input: Supplier | null): Observable<Supplier> {
        let _url = "/api/services/app/Supplier/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "Supplier": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除产品
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/Supplier/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

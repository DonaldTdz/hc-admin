import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { InventoryFlow } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class InventoryFlowService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/InventoryFlow/GetPagedAsync";
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
    GetById(id: string): Observable<InventoryFlow> {
        let _url = "/api/services/app/InventoryFlow/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return InventoryFlow.fromJS(data);
        }));
    }

    /**
     * 更新与创建产品库存流水
     * @param input 
     */
    createOrUpdate(input: InventoryFlow | null): Observable<InventoryFlow> {
        let _url = "/api/services/app/InventoryFlow/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "InventoryFlow": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除产品库存流水
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/InventoryFlow/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

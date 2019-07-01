import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { Implement } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class ImplementService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/Implement/GetPagedAsync";
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
    getById(id: any): Observable<Implement> {
        let _url = "/api/services/app/Implement/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Implement.fromJS(data);
        }));
    }


    /**
     * 更新与创建执行
     * @param input 
     */
    createOrUpdate(input: Implement | null): Observable<Implement> {
        let _url = "/api/services/app/Implement/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "Implement": input }).pipe(map(data => {
            return Implement.fromJS(data);
        }))
    }


    /**
     * 删除执行
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/Implement/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

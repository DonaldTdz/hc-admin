import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { PagedResultDto } from "@shared/component-base";
import { ReimburseDetail } from 'entities'

@Injectable()
export class ReimburseDetailService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }

    /**
* 获取分页数据
*/
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/ReimburseDetail/GetPagedAsync";
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
    getById(id: any): Observable<ReimburseDetail> {
        let _url = "/api/services/app/ReimburseDetail/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return ReimburseDetail.fromJS(data);
        }));
    }

    /**
* 更新与创建报销明细
* @param input 
*/
    createOrUpdate(input: ReimburseDetail | null): Observable<number> {
        let _url = "/api/services/app/ReimburseDetail/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "ReimburseDetail": input }).pipe(map(data => {
            return data;
        }))
    }

    /**
 * 删除报销明细
 * @param id 
 */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/ReimburseDetail/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

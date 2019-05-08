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

}

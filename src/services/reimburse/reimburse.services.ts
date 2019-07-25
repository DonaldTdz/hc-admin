import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { PagedResultDto } from "@shared/component-base";
import { Reimburse } from 'entities'

@Injectable()
export class ReimburseService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }

    /**
  * 获取分页数据
  */
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/Reimburse/GetPagedAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultDto();
            result.items = data.items;
            result.totalCount = data.totalCount;
            return result;
        }));
    }

    /**
* 提交报销
* @param input 
*/
    submitApproval(reimburse: any, reimburseDetails: any): Observable<any> {
        let _url = "/api/services/app/Reimburse/SubmitApprovalAsync";
        return this._commonhttp.post(_url, { "Reimburse": reimburse, "ReimburseDetails": reimburseDetails }).pipe(map(data => {
            return data;
        }))
    }

    /**
* 获取单条数据详细信息
* @param id 
*/
    getById(id: any): Observable<Reimburse> {
        let _url = "/api/services/app/Reimburse/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Reimburse.fromJS(data);
        }));
    }

}

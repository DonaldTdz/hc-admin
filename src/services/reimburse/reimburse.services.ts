import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { PagedResultNewDto } from "@shared/component-base";
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
    getAll(params: any): Observable<PagedResultNewDto<number>> {
        let url_ = "/api/services/app/Reimburse/GetPagedAsync";
        return this._commonhttp.get(url_, params).pipe(map(data => {
            const result = new PagedResultNewDto<number>();
            result.items = data.items;
            result.totalCount = data.totalCount;
            result.common = data.totalAmount
            return result;
        }));
    }

    /**
* 提交报销
* @param input 
*/
    submitApproval(id: string): Observable<any> {
        let _url = "/api/services/app/Reimburse/SubmitApprovalAsync";
        return this._commonhttp.post(_url, { "id": id }).pipe(map(data => {
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

    /**
 * 更新与创建报销
 * @param input 
 */
    createOrUpdate(input: Reimburse | null): Observable<Reimburse> {
        let _url = "/api/services/app/Reimburse/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "Reimburse": input }).pipe(map(data => {
            return data;
        }))
    }

    /**
* 删除报销
* @param id 
*/
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/Reimburse/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }


    /**
* 修改发放状态
* @param input 
*/
    modifyGrantStatus(guid: string, grantStatus: boolean): Observable<boolean> {
        let _url = "/api/services/app/Reimburse/ModifyGrantStatusAsync";
        return this._commonhttp.post(_url, { "id": guid, "grantStatus": grantStatus }).pipe(map(data => {
            return data;
        }))
    }
}

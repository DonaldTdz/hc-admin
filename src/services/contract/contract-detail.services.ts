import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { ContractDetail } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class ContractDetailService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/ContractDetail/GetPagedAsync";
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
    getById(id: string): Observable<ContractDetail> {
        let _url = "/api/services/app/ContractDetail/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return ContractDetail.fromJS(data);
        }));
    }

    /**
     * 更新与创建合同明细
     * @param input 
     */
    createOrUpdate(input: ContractDetail | null): Observable<ContractDetail> {
        let _url = "/api/services/app/ContractDetail/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "ContractDetail": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除合同明细
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/ContractDetail/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

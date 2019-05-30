import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { Contract } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class ContractService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/Contract/GetPagedAsync";
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
    getById(id: any): Observable<Contract> {
        let _url = "/api/services/app/Contract/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Contract.fromJS(data);
        }));
    }

    /**
     * 获取自动生成的合同编号
     * @param codeType 
     */
    getPurchaseCode(codeType: any): Observable<string> {
        let _url = "/api/services/app/Contract/GetContractCodeAsync";
        return this._commonhttp.get(_url, { 'CodeType': codeType }).pipe(map(data => {
            return data;
        }));
    }


    /**
     * 更新与创建合同
     * @param input 
     */
    createOrUpdate(input: Contract | null): Observable<Contract> {
        let _url = "/api/services/app/Contract/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "Contract": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
    * 创建合同与合同明细
    * @param input 
    */
    CreateContractAndDetail(input: Contract | null, contractDetails: any): Observable<Contract> {
        let _url = "/api/services/app/Contract/CreateContractAndDetailAsync";
        return this._commonhttp.post(_url, { "Contract": input, "ContractDetails": contractDetails }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除合同
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/Contract/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

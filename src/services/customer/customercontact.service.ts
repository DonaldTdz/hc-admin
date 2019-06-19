import { Inject, Optional, Injectable } from "@angular/core";
import { Observer, Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { PagedResultDto } from "@shared/component-base";
import { CustomerContact } from "entities";

@Injectable()
export class CustomerContactService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }

    /**
      * 获取客户联系人消息
      * @param param 
      */
    getPage(param: any): Observable<PagedResultDto> {
        let _url = "/api/services/app/CustomerContact/GetPagedAsync";
        return this._commonhttp.get(_url, param).pipe(map(data => {
            const result = new PagedResultDto();
            result.items = data.items;
            result.totalCount = data.totalCount;
            return result;
        }));
    }

    //获取客户下拉列表
    getDropDownDtos(): Observable<any> {
        let _url = "/api/services/app/CustomerContact/GetDropDownDtosAsync";
        return this._commonhttp.get(_url).pipe(map(data => {
            return data;
        }));
    }


    /**
        * 获取单个客户消息
        * @param id 
        */
    getById(id: string): Observable<CustomerContact> {
        let _url = "/api/services/app/CustomerContact/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return CustomerContact.fromJS(data);
        }));
    }


    /**
   * 删除客户消息
   * @param id 
   */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/CustomerContact/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

    /**
    * 新增更新
    * @param input 
    */
    createOrUpdate(input: CustomerContact): Observable<CustomerContact> {
        let _url = "/api/services/app/CustomerContact/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "CustomerContact": input }).pipe(map(data => {
            return data;
        }))
    }

    //获取客户联系人下拉列表
    getContactByCustomerId(customerId: string): Observable<any> {
        let _url = "/api/services/app/CustomerContact/GetContactByCustomerIdAsync";
        return this._commonhttp.get(_url, { "customerId": customerId }).pipe(map(data => {
            return data;
        }));
    }
}

import { Inject, Optional, Injectable } from "@angular/core";
import { Observer, Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { PagedResultDto } from "@shared/component-base";
import { Customer } from "entities";

@Injectable()
export class CustomerService {
  private _commonhttp: CommonHttpClient;

  constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
    this._commonhttp = commonhttp;
  }

  /**
    * 获取客户消息
    * @param param 
    */
  getPage(param: any): Observable<PagedResultDto> {
    let _url = "/api/services/app/Customer/GetPaged";
    return this._commonhttp.get(_url, param).pipe(map(data => {
      const result = new PagedResultDto();
      result.items = data.items;
      result.totalCount = data.totalCount;
      return result;
    }));
  }

  /**
      * 获取单个客户消息
      * @param id 
      */
  getById(id: string): Observable<Customer> {
    let _url = "/api/services/app/Customer/GetById";
    let param = { 'id': id };
    return this._commonhttp.get(_url, param).pipe(map(data => {
      return Customer.fromJS(data);
    }));
  }


  /**
 * 删除客户消息
 * @param id 
 */
  delete(id: string): Observable<any> {
    let _url = "/api/services/app/Customer/Delete";
    let param = { 'id': id };
    return this._commonhttp.delete(_url, param);
  }

  /**
  * 更新图文消息
  * @param input 
  */
  update(input: Customer): Observable<Customer> {
    let _url = "/api/services/app/Customer/CreateOrUpdate";
    return this._commonhttp.post(_url, input).pipe(map(data => {
      return data;
    }))
  }
}

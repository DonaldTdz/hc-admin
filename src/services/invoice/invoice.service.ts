import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { Invoice } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class InvoiceService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/Invoice/GetPagedAsync";
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
    getById(id: any): Observable<Invoice> {
        let _url = "/api/services/app/Invoice/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Invoice.fromJS(data);
        }));
    }

    /**
* 获取编辑Invoice
* @param id 
*/
    getForEdit(id: any): Observable<Invoice> {
        let _url = "/api/services/app/Invoice/GetForEditAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Invoice.fromJS(data.Invoice);
        }));
    }


    /**
     * 更新与创建发票
     * @param input 
     */
    createOrUpdate(input: Invoice | null): Observable<Invoice> {
        let _url = "/api/services/app/Invoice/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "Invoice": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除项目
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/Invoice/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

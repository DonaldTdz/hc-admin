import { Inject, Optional, Injectable } from "@angular/core";
import { Observer, Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map, count } from "rxjs/operators";
import { Product, Parameter } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class ProductService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/Product/GetPagedAsync";
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
    GetById(id: string): Observable<Product> {
        let _url = "/api/services/app/Product/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Product.fromJS(data);
        }));
    }

    /**
     * 更新与创建产品
     * @param input 
     */
    createOrUpdate(input: Product | null): Observable<Product> {
        let _url = "/api/services/app/Product/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "Product": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除产品
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/Product/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

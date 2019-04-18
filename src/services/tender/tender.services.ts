import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { PagedResultDto } from "@shared/component-base";
import { Tender } from 'entities'

@Injectable()
export class TenderService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/Tender/GetPagedAsync";
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
    getById(id: any): Observable<Tender> {
        let _url = "/api/services/app/Tender/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Tender.fromJS(data);
        }));
    }

    /**
* 获取编辑Project
* @param id 
*/
    getForEdit(id: any): Observable<Tender> {
        let _url = "/api/services/app/Tender/GetForEditAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Tender.fromJS(data.tender);
        }));
    }

    /**
     * 更新与创建项目
     * @param input 
     */
    createOrUpdate(input: Tender | null): Observable<Tender> {
        let _url = "/api/services/app/Tender/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "Tender": input }).pipe(map(data => {
            return data;
        }))
    }

    /**
     * 获取招标提醒信息
     */
    getTenderRemindData(): Observable<any> {
        let _url = "/api/services/app/Tender/GetTenderRemindData";
        return this._commonhttp.get(_url).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除项目
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/Tender/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

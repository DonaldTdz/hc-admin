import { Inject, Optional, Injectable } from "@angular/core";
import { Observer, Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map } from "rxjs/operators";
import { Project } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class ProjectService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/Project/GetPagedAsync";
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
    getById(id: any): Observable<Project> {
        let _url = "/api/services/app/Project/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Project.fromJS(data);
        }));
    }

    /**
* 获取编辑Project
* @param id 
*/
    getForEdit(id: any): Observable<Project> {
        let _url = "/api/services/app/Project/GetForEditAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return Project.fromJS(data.project);
        }));
    }

    //获取项目下拉列表
    getDropDownDtos(): Observable<any> {
        let _url = "/api/services/app/Project/GetDropDownDtos";
        return this._commonhttp.get(_url).pipe(map(data => {
            return JSON.parse(data);
        }));
    }

    /**
     * 更新与创建项目
     * @param input 
     */
    createOrUpdate(input: Project | null): Observable<Project> {
        let _url = "/api/services/app/Project/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "Project": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 删除项目
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/Project/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

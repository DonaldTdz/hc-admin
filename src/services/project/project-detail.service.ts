import { Inject, Optional, Injectable } from "@angular/core";
import { Observer, Observable } from "rxjs";
import { CommonHttpClient } from "services/common-httpclient";
import { map, count } from "rxjs/operators";
import { ProjectDetail } from "entities";
import { PagedResultDto } from "@shared/component-base";

@Injectable()
export class ProjectDetailService {
    private _commonhttp: CommonHttpClient;

    constructor(@Inject(CommonHttpClient) commonhttp: CommonHttpClient) {
        this._commonhttp = commonhttp;
    }
    //获取分页数据
    getAll(params: any): Observable<PagedResultDto> {
        let url_ = "/api/services/app/ProjectDetail/GetPagedAsync";
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
    GetById(id: string): Observable<ProjectDetail> {
        let _url = "/api/services/app/ProjectDetail/GetByIdAsync";
        let param = { 'id': id };
        return this._commonhttp.get(_url, param).pipe(map(data => {
            return ProjectDetail.fromJS(data);
        }));
    }

    /**
     * 更新与创建项目明细
     * @param input 
     */
    createOrUpdate(input: ProjectDetail | null): Observable<ProjectDetail> {
        let _url = "/api/services/app/ProjectDetail/CreateOrUpdateAsync";
        return this._commonhttp.post(_url, { "ProjectDetail": input }).pipe(map(data => {
            return data;
        }))
    }


    /**
     * 根据项目id获取项目明细下拉列表
     * @param projectId 
     */
    GetDropDownsByProjectId(projectId: any): Observable<any> {
        let _url = "/api/services/app/ProjectDetail/GetDropDownsByProjectIdAsync";
        return this._commonhttp.get(_url, { projectId: projectId }).pipe(map(data => {
            return data;
        }));
    }


    /**
     * 删除项目明细
     * @param id 
     */
    delete(id: string): Observable<any> {
        let _url = "/api/services/app/ProjectDetail/DeleteAsync";
        let param = { 'id': id };
        return this._commonhttp.delete(_url, param);
    }

}

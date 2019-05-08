export class TimeSheet {
    id: string;
    projectId: string;
    workeDate: Date;
    employeeId: string;
    hour: number;
    content: string;
    status: number;
    approverId: string;
    approvalTime: Date;
    creationTime: Date;
    constructor(data?: any) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.projectId = data["projectId"];
            this.workeDate = data["workeDate"];
            this.employeeId = data["employeeId"];
            this.hour = data["hour"];
            this.content = data["content"];
            this.status = data["status"];
            this.approverId = data["approverId"];
            this.approvalTime = data["approvalTime"];
            this.creationTime = data["creationTime"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["projectId"] = this.projectId;
        data["workeDate"] = this.workeDate;
        data["employeeId"] = this.employeeId;
        data["hour"] = this.hour;
        data["content"] = this.content;
        data["status"] = this.status;
        data["approverId"] = this.approverId;
        data["approvalTime"] = this.approvalTime;
        data["creationTime"] = this.creationTime;
        return data;
    }
    static fromJS(data: any): TimeSheet {
        let result = new TimeSheet();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): TimeSheet[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new TimeSheet();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new TimeSheet();
        result.init(json);
        return result;
    }
}
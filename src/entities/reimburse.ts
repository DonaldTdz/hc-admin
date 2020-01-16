export class Reimburse {
    id: string;
    projectId: string;
    employeeId: string;
    amount: number;
    status: number;
    type: number;
    grantStatus: boolean;
    submitDate: Date;
    approverId: string;
    approvalTime: Date;
    cancelTime: Date;
    creationTime: Date;
    projectName: string;
    employeeName: string;
    approverName: string;
    typeName: string;
    grantStatusName: string;
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
            this.employeeId = data["employeeId"];
            this.amount = data["amount"];
            this.status = data["status"];
            this.type = data["type"];
            this.grantStatus = data["grantStatus"];
            this.submitDate = data["submitDate"];
            this.approverId = data["approverId"];
            this.approvalTime = data["approvalTime"];
            this.cancelTime = data["cancelTime"];
            this.creationTime = data["creationTime"];
            this.projectName = data["projectName"];
            this.employeeName = data["employeeName"];
            this.approverName = data["approverName"];
            this.typeName = data["typeName"];
            this.grantStatusName = data["grantStatusName"]
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["projectId"] = this.projectId;
        data["employeeId"] = this.employeeId;
        data["amount"] = this.amount;
        data["status"] = this.status;
        data["type"] = this.type;
        data["grantStatus"] = this.grantStatus;
        data["submitDate"] = this.submitDate;
        data["approverId"] = this.approverId;
        data["approvalTime"] = this.approvalTime;
        data["cancelTime"] = this.cancelTime;
        data["creationTime"] = this.creationTime;
        data["grantStatusName"] = this.grantStatusName;
        return data;
    }
    static fromJS(data: any): Reimburse {
        let result = new Reimburse();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Reimburse[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Reimburse();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Reimburse();
        result.init(json);
        return result;
    }
}
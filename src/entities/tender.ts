export class Tender {
    id: string;
    projectId: string;
    tenderTime: Date;
    bond: number;
    bondTime: Date;
    isPayBond: boolean;
    readyTime: Date;
    isReady: boolean;
    employeeId: string;
    readyEmployeeIds: string;
    isWinbid: boolean;
    attachments: string;
    isDeleted: boolean;
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    deletionTime: Date;
    deleterUserId: number;
    projectName: string;
    employeeName: string;
    readyEmployeeNames: string;
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
            this.tenderTime = data["tenderTime"];
            this.bond = data["bond"];
            this.bondTime = data["bondTime"];
            this.isPayBond = data["isPayBond"];
            this.readyTime = data["readyTime"];
            this.isReady = data["isReady"];
            this.employeeId = data["employeeId"];
            this.readyEmployeeIds = data["readyEmployeeIds"];
            this.isWinbid = data["isWinbid"];
            this.attachments = data["attachments"];
            this.isDeleted = data["isDeleted"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
            this.deletionTime = data["deletionTime"];
            this.deleterUserId = data["deleterUserId"];
            this.projectName = data["projectName"];
            this.employeeName = data["employeeName"];
            this.readyEmployeeNames = data["readyEmployeeNames"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["projectId"] = this.projectId;
        data["tenderTime"] = this.tenderTime;
        data["bond"] = this.bond;
        data["bondTime"] = this.bondTime;
        data["isPayBond"] = this.isPayBond;
        data["readyTime"] = this.readyTime;
        data["isReady"] = this.isReady;
        data["employeeId"] = this.employeeId;
        data["readyEmployeeIds"] = this.readyEmployeeIds;
        data["isWinbid"] = this.isWinbid;
        data["attachments"] = this.attachments;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        data["projectName"] = this.projectName;
        data["employeeName"] = this.employeeName;
        data["readyEmployeeNames"] = this.readyEmployeeNames;
        return data;
    }
    static fromJS(data: any): Tender {
        let result = new Tender();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Tender[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Tender();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Tender();
        result.init(json);
        return result;
    }
}
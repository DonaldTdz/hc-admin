export class Purchase {
    id: string;
    code: string;
    employeeId: string;
    purchaseDate: Date;
    arrivalDate: Date;
    attachments: string;
    desc: string;
    isDeleted: boolean;
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    deletionTime: Date;
    deleterUserId: number;
    employeeName: string;
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
            this.code = data["code"];
            this.arrivalDate = data["arrivalDate"];
            this.attachments = data["attachments"];
            this.employeeId = data["employeeId"];
            this.purchaseDate = data["purchaseDate"];
            this.desc = data["desc"];
            this.isDeleted = data["isDeleted"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
            this.deletionTime = data["deletionTime"];
            this.deleterUserId = data["deleterUserId"];
            this.employeeName = data["employeeName"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["code"] = this.code;
        data["arrivalDate"] = this.arrivalDate;
        data["attachments"] = this.attachments;
        data["employeeId"] = this.employeeId;
        data["purchaseDate"] = this.purchaseDate;
        data["desc"] = this.desc;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        return data;
    }
    static fromJS(data: any): Purchase {
        let result = new Purchase();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Purchase[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Purchase();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Purchase();
        result.init(json);
        return result;
    }
}
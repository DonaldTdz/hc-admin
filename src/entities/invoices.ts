export class Invoice {
    id: string;
    title: string;
    type: number;
    code: string;
    amount: number;
    submitDate: Date;
    attachments: string;
    refId: string;
    isDeleted: boolean;
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    deletionTime: Date;
    deleterUserId: number;
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
            this.title = data["title"];
            this.type = data["type"];
            this.code = data["code"];
            this.amount = data["amount"];
            this.submitDate = data["submitDate"];
            this.attachments = data["attachments"];
            this.refId = data["refId"];
            this.isDeleted = data["isDeleted"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
            this.deletionTime = data["deletionTime"];
            this.deleterUserId = data["deleterUserId"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["title"] = this.title;
        data["type"] = this.type;
        data["code"] = this.code;
        data["amount"] = this.amount;
        data["submitDate"] = this.submitDate;
        data["attachments"] = this.attachments;
        data["refId"] = this.refId;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        return data;
    }
    static fromJS(data: any): Invoice {
        let result = new Invoice();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Invoice[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Invoice();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Invoice();
        result.init(json);
        return result;
    }
}
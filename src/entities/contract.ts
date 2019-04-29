export class Contract {
    id: string;
    type: number;
    contractCode: string;
    codeType: number;
    refId: string;
    signatureTime: Date;
    amount: number;
    desc: string;
    attachments: string;
    isDeleted: boolean;
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    deletionTime: Date;
    deleterUserId: number;
    typeName: string;
    refName: string;
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
            this.type = data["type"];
            this.contractCode = data["contractCode"];
            this.codeType = data["codeType"];
            this.refId = data["refId"];
            this.signatureTime = data["signatureTime"];
            this.amount = data["amount"];
            this.desc = data["desc"];
            this.attachments = data["attachments"];
            this.isDeleted = data["isDeleted"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
            this.deletionTime = data["deletionTime"];
            this.deleterUserId = data["deleterUserId"];
            this.typeName = data["typeName"];
            this.refName = data["refName"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["type"] = this.type;
        data["contractCode"] = this.contractCode;
        data["codeType"] = this.codeType;
        data["refId"] = this.refId;
        data["signatureTime"] = this.signatureTime;
        data["amount"] = this.amount;
        data["desc"] = this.desc;
        data["attachments"] = this.attachments;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        data["typeName"] = this.typeName;
        data["refName"] = this.refName;
        return data;
    }
    static fromJS(data: any): Contract {
        let result = new Contract();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Contract[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Contract();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Contract();
        result.init(json);
        return result;
    }
}
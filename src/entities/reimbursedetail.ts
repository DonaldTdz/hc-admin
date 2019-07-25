export class ReimburseDetail {
    id: string;
    reimburseId: string;
    happenDate: Date;
    type: string;
    place: string;
    customer: string;
    desc: string;
    amount: number;
    invoiceNum: number;
    remark: string;
    attachments: string;
    creationTime: Date;
    typeName: string;
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
            this.reimburseId = data["reimburseId"];
            this.happenDate = data["happenDate"];
            this.type = data["type"];
            this.place = data["place"];
            this.customer = data["customer"];
            this.desc = data["desc"];
            this.amount = data["amount"];
            this.invoiceNum = data["invoiceNum"];
            this.remark = data["remark"];
            this.attachments = data["attachments"];
            this.creationTime = data["creationTime"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["reimburseId"] = this.reimburseId;
        data["happenDate"] = this.happenDate;
        data["type"] = this.type;
        data["place"] = this.place;
        data["customer"] = this.customer;
        data["desc"] = this.desc;
        data["amount"] = this.amount;
        data["invoiceNum"] = this.invoiceNum;
        data["remark"] = this.remark;
        data["attachments"] = this.attachments;
        data["creationTime"] = this.creationTime;
        return data;
    }
    static fromJS(data: any): ReimburseDetail {
        let result = new ReimburseDetail();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): ReimburseDetail[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new ReimburseDetail();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new ReimburseDetail();
        result.init(json);
        return result;
    }
}
export class AdvancePayment {
    id: string;
    purchaseId: string;
    planTime: Date;
    desc: string;
    ratio: number;
    amount: number;
    status: number;
    paymentTime: Date;
    creationTime: Date;
    statusName: string;
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
            this.purchaseId = data["purchaseId"];
            this.planTime = data["planTime"];
            this.desc = data["desc"];
            this.ratio = data["ratio"];
            this.amount = data["amount"];
            this.status = data["status"];
            this.paymentTime = data["paymentTime"];
            this.creationTime = data["creationTime"];
            this.statusName = data["statusName"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["purchaseId"] = this.purchaseId;
        data["planTime"] = this.planTime;
        data["desc"] = this.desc;
        data["ratio"] = this.ratio;
        data["amount"] = this.amount;
        data["status"] = this.status;
        data["paymentTime"] = this.paymentTime;
        data["creationTime"] = this.creationTime;
        return data;
    }
    static fromJS(data: any): AdvancePayment {
        let result = new AdvancePayment();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): AdvancePayment[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new AdvancePayment();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new AdvancePayment();
        result.init(json);
        return result;
    }
}
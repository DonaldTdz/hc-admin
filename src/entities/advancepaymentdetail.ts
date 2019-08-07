export class AdvancePaymentDetail {
    id: string;
    advancePaymentId: string;
    purchaseDetailId: string;
    ratio: number;
    amount: number;
    creationTime: Date;
    purchaseDetailName: string;
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
            this.advancePaymentId = data["advancePaymentId"];
            this.purchaseDetailId = data["purchaseDetailId"];
            this.ratio = data["ratio"];
            this.amount = data["amount"];
            this.creationTime = data["creationTime"];
            this.purchaseDetailName = data["purchaseDetailName"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["advancePaymentId"] = this.advancePaymentId;
        data["purchaseDetailId"] = this.purchaseDetailId;
        data["ratio"] = this.ratio;
        data["amount"] = this.amount;
        data["creationTime"] = this.creationTime;
        data["purchaseDetailName"] = this.purchaseDetailName;
        return data;
    }
    static fromJS(data: any): AdvancePaymentDetail {
        let result = new AdvancePaymentDetail();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): AdvancePaymentDetail[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new AdvancePaymentDetail();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new AdvancePaymentDetail();
        result.init(json);
        return result;
    }
}
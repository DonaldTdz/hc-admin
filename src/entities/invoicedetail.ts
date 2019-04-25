export class InvoiceDetail {
    id: string;
    invoiceId: string;
    refId: string;
    name: string;
    specification: string;
    unit: string;
    num: number;
    price: number;
    taxRate: string;
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
            this.invoiceId = data["invoiceId"];
            this.refId = data["refId"];
            this.name = data["name"];
            this.specification = data["specification"];
            this.unit = data["unit"];
            this.num = data["num"];
            this.price = data["price"];
            this.taxRate = data["taxRate"];
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
        data["invoiceId"] = this.invoiceId;
        data["refId"] = this.refId;
        data["name"] = this.name;
        data["specification"] = this.specification;
        data["unit"] = this.unit;
        data["num"] = this.num;
        data["price"] = this.price;
        data["taxRate"] = this.taxRate;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        return data;
    }
    static fromJS(data: any): InvoiceDetail {
        let result = new InvoiceDetail();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): InvoiceDetail[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new InvoiceDetail();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new InvoiceDetail();
        result.init(json);
        return result;
    }
}
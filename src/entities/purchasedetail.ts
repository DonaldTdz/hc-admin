export class PurchaseDetail {
    id: string;
    purchaseId: string;
    supplierId: number;
    productId: number;
    num: number;
    isDeleted: boolean;
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    deletionTime: Date;
    deleterUserId: number;
    supplierName: string;
    price: number;
    name: string;
    taxRate: string;
    specification: string;
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
            this.supplierId = data["supplierId"].toString();
            this.productId = data["productId"];
            this.num = data["num"];
            this.isDeleted = data["isDeleted"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
            this.deletionTime = data["deletionTime"];
            this.deleterUserId = data["deleterUserId"];
            this.price = data["price"];
            this.name = data["name"];
            this.taxRate = data["taxRate"];
            this.specification = data["specification"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["purchaseId"] = this.purchaseId;
        data["supplierId"] = this.supplierId;
        data["productId"] = this.productId;
        data["num"] = this.num;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        data["price"] = this.price;
        data["name"] = this.name;
        data["taxRate"] = this.taxRate;
        data["specification"] = this.specification;
        return data;
    }
    static fromJS(data: any): PurchaseDetail {
        let result = new PurchaseDetail();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): PurchaseDetail[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new PurchaseDetail();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new PurchaseDetail();
        result.init(json);
        return result;
    }
}
export class PurchaseDetailNew {
    id: string;
    purchaseId: string;
    supplierId: number;
    productId: number;
    num: number;
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
            this.purchaseId = data["purchaseId"];
            this.supplierId = data["supplierId"];
            this.productId = data["productId"];
            this.num = data["num"];
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
        data["purchaseId"] = this.purchaseId;
        data["supplierId"] = this.supplierId;
        data["productId"] = this.productId;
        data["num"] = this.num;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        return data;
    }
    static fromJS(data: any): PurchaseDetailNew {
        let result = new PurchaseDetailNew();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): PurchaseDetailNew[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new PurchaseDetailNew();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new PurchaseDetailNew();
        result.init(json);
        return result;
    }
}
export class ContractDetail {
    id: string;
    contractId: string;
    productId: number;
    name: string;
    model: string;
    num: number;
    price: number;
    isDeleted: boolean;
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    deletionTime: Date;
    deleterUserId: number;
    refDetailName: string;
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
            this.contractId = data["contractId"];
            this.productId = data["productId"];
            this.name = data["name"];
            this.model = data["model"];
            this.num = data["num"];
            this.price = data["price"];
            this.isDeleted = data["isDeleted"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
            this.deletionTime = data["deletionTime"];
            this.deleterUserId = data["deleterUserId"];
            this.refDetailName = data["refDetailName"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["contractId"] = this.contractId;
        data["productId"] = this.productId;
        data["name"] = this.name;
        data["model"] = this.model;
        data["num"] = this.num;
        data["price"] = this.price;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        return data;
    }
    static fromJS(data: any): ContractDetail {
        let result = new ContractDetail();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): ContractDetail[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new ContractDetail();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new ContractDetail();
        result.init(json);
        return result;
    }
}
export class ProjectDetail {
    id: string;
    projectId: string;
    type: string;
    name: string;
    specification: string;
    unit: string;
    num: number;
    price: number;
    productId: number;
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
            this.projectId = data["projectId"];
            this.type = data["type"];
            this.name = data["name"];
            this.specification = data["specification"];
            this.unit = data["unit"];
            this.num = data["num"];
            this.price = data["price"];
            this.productId = data["productId"];
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
        data["projectId"] = this.projectId;
        data["type"] = this.type;
        data["name"] = this.name;
        data["specification"] = this.specification;
        data["unit"] = this.unit;
        data["num"] = this.num;
        data["price"] = this.price;
        data["productId"] = this.productId;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        return data;
    }
    static fromJS(data: any): ProjectDetail {
        let result = new ProjectDetail();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): ProjectDetail[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new ProjectDetail();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new ProjectDetail();
        result.init(json);
        return result;
    }
}
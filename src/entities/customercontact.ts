export class CustomerContact {
    id: string;
    customerId: number;
    name: string;
    deptName: string;
    position: string;
    phone: string;
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
            this.customerId = data["customerId"];
            this.name = data["name"];
            this.deptName = data["deptName"];
            this.position = data["position"];
            this.phone = data["phone"];
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
        data["customerId"] = this.customerId;
        data["name"] = this.name;
        data["deptName"] = this.deptName;
        data["position"] = this.position;
        data["phone"] = this.phone;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        return data;
    }
    static fromJS(data: any): CustomerContact {
        let result = new CustomerContact();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): CustomerContact[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new CustomerContact();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new CustomerContact();
        result.init(json);
        return result;
    }
}
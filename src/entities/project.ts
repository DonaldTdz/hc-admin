
export class Project {
    id: string;
    mode: number;
    profitRatio: number;
    billCost: number;
    type: string;
    projectCode: string;
    projectSalesId: string;
    salesAssistantId: string;
    name: string;
    customerId: number;
    startDate: Date;
    endDate: Date;
    budget: number;
    implementMoney: number;
    status: number;
    desc: string;
    isDeleted: boolean;
    creationTime: Date;
    creatorUserId: number;
    lastModificationTime: Date;
    lastModifierUserId: number;
    deletionTime: Date;
    deleterUserId: number;
    projectSalesName: string;
    salesAssistantName: string
    customerName: string;
    modeName: string;
    statusName: string;
    customerContactId: number;
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
            this.mode = data["mode"];
            this.profitRatio = data["profitRatio"];
            this.billCost = data["billCost"];
            this.type = data["type"];
            this.projectCode = data["projectCode"];
            this.projectSalesId = data["projectSalesId"];
            this.salesAssistantId = data["salesAssistantId"];
            this.name = data["name"];
            this.customerId = data["customerId"].toString();
            // this.employeeId = data["employeeId"];
            this.startDate = data["startDate"];
            this.endDate = data["endDate"];
            // this.year = data["year"];
            this.budget = data["budget"];
            this.implementMoney = data["implementMoney"];
            this.status = data["status"];
            this.desc = data["desc"];
            this.isDeleted = data["isDeleted"];
            this.creationTime = data["creationTime"];
            this.creatorUserId = data["creatorUserId"];
            this.lastModificationTime = data["lastModificationTime"];
            this.lastModifierUserId = data["lastModifierUserId"];
            this.deletionTime = data["deletionTime"];
            this.deleterUserId = data["deleterUserId"];
            this.projectSalesName = data["projectSalesName"];
            this.salesAssistantName = data["salesAssistantName"];
            this.customerName = data["customerName"];
            this.modeName = data["modeName"];
            this.statusName = data["statusName"];
            this.customerContactId = data["customerContactId"].toString();
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["mode"] = this.mode;
        data["profitRatio"] = this.profitRatio;
        data["billCost"] = this.billCost;
        data["type"] = this.type;
        data["projectCode"] = this.projectCode;
        data["projectSalesId"] = this.projectSalesId;
        data["salesAssistantId"] = this.salesAssistantId;
        data["name"] = this.name;
        data["customerId"] = this.customerId;
        // data["employeeId"] = this.employeeId;
        data["startDate"] = this.startDate;
        data["endDate"] = this.endDate;
        // data["year"] = this.year;
        data["budget"] = this.budget;
        data["implementMoney"] = this.implementMoney;
        data["status"] = this.status;
        data["desc"] = this.desc;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        data["customerContactId"] = this.customerContactId;
        return data;
    }
    static fromJS(data: any): Project {
        let result = new Project();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Project[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Project();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Project();
        result.init(json);
        return result;
    }
}
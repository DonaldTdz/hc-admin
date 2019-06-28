export class Tender {
    id: string;
    projectId: string;
    tenderTime: Date;
    bond: number;
    bondTime: Date;
    isPayBond: boolean;
    readyTime: Date;
    isReady: boolean;
    purchaseStartDate: Date;
    purchaseEndDate: Date;
    bidPurchaser: string;
    purchaseInformation: string;
    buyBidingPerson: string;
    preparationPerson: string;
    qualification: string;
    organizer: string;
    inspector: string;
    binder: string;
    employeeId: string;
    readyEmployeeIds: string;
    isWinbid: boolean;
    attachments: string;
    voucher: string;
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
            this.tenderTime = data["tenderTime"];
            this.bond = data["bond"];
            this.bondTime = data["bondTime"];
            this.isPayBond = data["isPayBond"];
            this.readyTime = data["readyTime"];
            this.isReady = data["isReady"];
            this.purchaseStartDate = data["purchaseStartDate"];
            this.purchaseEndDate = data["purchaseEndDate"];
            this.bidPurchaser = data["bidPurchaser"];
            this.purchaseInformation = data["purchaseInformation"];
            this.buyBidingPerson = data["buyBidingPerson"];
            this.preparationPerson = data["preparationPerson"];
            this.qualification = data["qualification"];
            this.organizer = data["organizer"];
            this.inspector = data["inspector"];
            this.binder = data["binder"];
            this.employeeId = data["employeeId"];
            this.readyEmployeeIds = data["readyEmployeeIds"];
            this.isWinbid = data["isWinbid"];
            this.attachments = data["attachments"];
            this.voucher = data["voucher"];
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
        data["tenderTime"] = this.tenderTime;
        data["bond"] = this.bond;
        data["bondTime"] = this.bondTime;
        data["isPayBond"] = this.isPayBond;
        data["readyTime"] = this.readyTime;
        data["isReady"] = this.isReady;
        data["purchaseStartDate"] = this.purchaseStartDate;
        data["purchaseEndDate"] = this.purchaseEndDate;
        data["bidPurchaser"] = this.bidPurchaser;
        data["purchaseInformation"] = this.purchaseInformation;
        data["buyBidingPerson"] = this.buyBidingPerson;
        data["preparationPerson"] = this.preparationPerson;
        data["qualification"] = this.qualification;
        data["organizer"] = this.organizer;
        data["inspector"] = this.inspector;
        data["binder"] = this.binder;
        data["employeeId"] = this.employeeId;
        data["readyEmployeeIds"] = this.readyEmployeeIds;
        data["isWinbid"] = this.isWinbid;
        data["attachments"] = this.attachments;
        data["voucher"] = this.voucher;
        data["isDeleted"] = this.isDeleted;
        data["creationTime"] = this.creationTime;
        data["creatorUserId"] = this.creatorUserId;
        data["lastModificationTime"] = this.lastModificationTime;
        data["lastModifierUserId"] = this.lastModifierUserId;
        data["deletionTime"] = this.deletionTime;
        data["deleterUserId"] = this.deleterUserId;
        return data;
    }
    static fromJS(data: any): Tender {
        let result = new Tender();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Tender[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Tender();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Tender();
        result.init(json);
        return result;
    }
}
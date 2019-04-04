export class Company {
    id: string;
    name: string;
    bank: string;
    bankAccount: string;
    dutyNo: string;
    address: string;
    tel: string;
    balance: number;
    attachments: string;
    creationTime: Date;
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
            this.name = data["name"];
            this.bank = data["bank"];
            this.bankAccount = data["bankAccount"];
            this.dutyNo = data["dutyNo"];
            this.address = data["address"];
            this.tel = data["tel"];
            this.balance = data["balance"];
            this.attachments = data["attachments"];
            this.creationTime = data["creationTime"];
        }
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["bank"] = this.bank;
        data["bankAccount"] = this.bankAccount;
        data["dutyNo"] = this.dutyNo;
        data["address"] = this.address;
        data["tel"] = this.tel;
        data["balance"] = this.balance;
        data["attachments"] = this.attachments;
        data["creationTime"] = this.creationTime;
        return data;
    }
    static fromJS(data: any): Company {
        let result = new Company();
        result.init(data);
        return result;
    }
    static fromJSArray(dataArray: any[]): Company[] {
        let array = [];
        dataArray.forEach(result => {
            let item = new Company();
            item.init(result);
            array.push(item);
        });
        return array;
    }
    clone() {
        const json = this.toJSON();
        let result = new Company();
        result.init(json);
        return result;
    }
}
export class Supplier {
    id: string;
   type: number;
   name: string;
   address: string;
   zipCode: string;
   tel: string;
   contact: string;
   position: string;
   phone: string;
   desc: string;
   remark: string;
   attachments: string;
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
   this.type = data["type"];
   this.name = data["name"];
   this.address = data["address"];
   this.zipCode = data["zipCode"];
   this.tel = data["tel"];
   this.contact = data["contact"];
   this.position = data["position"];
   this.phone = data["phone"];
   this.desc = data["desc"];
   this.remark = data["remark"];
   this.attachments = data["attachments"];
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
   data["type"] = this.type;
   data["name"] = this.name;
   data["address"] = this.address;
   data["zipCode"] = this.zipCode;
   data["tel"] = this.tel;
   data["contact"] = this.contact;
   data["position"] = this.position;
   data["phone"] = this.phone;
   data["desc"] = this.desc;
   data["remark"] = this.remark;
   data["attachments"] = this.attachments;
   data["isDeleted"] = this.isDeleted;
   data["creationTime"] = this.creationTime;
   data["creatorUserId"] = this.creatorUserId;
   data["lastModificationTime"] = this.lastModificationTime;
   data["lastModifierUserId"] = this.lastModifierUserId;
   data["deletionTime"] = this.deletionTime;
   data["deleterUserId"] = this.deleterUserId;
   return data;
   }
   static fromJS(data: any): Supplier {
   let result = new Supplier();
   result.init(data);
   return result;
   }
   static fromJSArray(dataArray: any[]): Supplier[] {
   let array = [];
   dataArray.forEach(result => {
   let item = new Supplier();
   item.init(result);
   array.push(item);
   });
   return array;
   }
   clone() {
   const json = this.toJSON();
   let result = new Supplier();
   result.init(json);
   return result;
   }
   }
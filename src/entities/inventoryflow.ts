export class InventoryFlow {
    id: string;
   productId: number;
   type: number;
   initial: number;
   streamNumber: number;
   ending: number;
   desc: string;
   refId: string;
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
   this.productId = data["productId"];
   this.type = data["type"];
   this.initial = data["initial"];
   this.streamNumber = data["streamNumber"];
   this.ending = data["ending"];
   this.desc = data["desc"];
   this.refId = data["refId"];
   this.creationTime = data["creationTime"];
   }
   }
   toJSON(data?: any) {
   data = typeof data === 'object' ? data : {};
   data["id"] = this.id;
   data["productId"] = this.productId;
   data["type"] = this.type;
   data["initial"] = this.initial;
   data["streamNumber"] = this.streamNumber;
   data["ending"] = this.ending;
   data["desc"] = this.desc;
   data["refId"] = this.refId;
   data["creationTime"] = this.creationTime;
   return data;
   }
   static fromJS(data: any): InventoryFlow {
   let result = new InventoryFlow();
   result.init(data);
   return result;
   }
   static fromJSArray(dataArray: any[]): InventoryFlow[] {
   let array = [];
   dataArray.forEach(result => {
   let item = new InventoryFlow();
   item.init(result);
   array.push(item);
   });
   return array;
   }
   clone() {
   const json = this.toJSON();
   let result = new InventoryFlow();
   result.init(json);
   return result;
   }
   }
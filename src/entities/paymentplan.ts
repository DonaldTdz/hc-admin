export class PaymentPlan {
    id: string;
   projectId: string;
   planTime: Date;
   desc: string;
   amount: number;
   status: number;
   paymentTime: Date;
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
   this.projectId = data["projectId"];
   this.planTime = data["planTime"];
   this.desc = data["desc"];
   this.amount = data["amount"];
   this.status = data["status"];
   this.paymentTime = data["paymentTime"];
   this.creationTime = data["creationTime"];
   }
   }
   toJSON(data?: any) {
   data = typeof data === 'object' ? data : {};
   data["id"] = this.id;
   data["projectId"] = this.projectId;
   data["planTime"] = this.planTime;
   data["desc"] = this.desc;
   data["amount"] = this.amount;
   data["status"] = this.status;
   data["paymentTime"] = this.paymentTime;
   data["creationTime"] = this.creationTime;
   return data;
   }
   static fromJS(data: any): PaymentPlan {
   let result = new PaymentPlan();
   result.init(data);
   return result;
   }
   static fromJSArray(dataArray: any[]): PaymentPlan[] {
   let array = [];
   dataArray.forEach(result => {
   let item = new PaymentPlan();
   item.init(result);
   array.push(item);
   });
   return array;
   }
   clone() {
   const json = this.toJSON();
   let result = new PaymentPlan();
   result.init(json);
   return result;
   }
   }
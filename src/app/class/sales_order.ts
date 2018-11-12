import { Model } from "./model";
import { SalesOrderDetail } from "./sales_order_detail";
import { Stage } from "./stage";

export class SalesOrder extends Model{
    soCode:string;
    trxnDate:Date;
    estDeliveryDate:Date;
    totalAmount:number;
    totalTaxAmount:number;
    shippingCost:number;
    custId:number;
    custName:string;
    sods:SalesOrderDetail[];
    nDraft:number;
    nAwApproval:number;
    nAwPayment:number;
    nOverdue:number;
    referrence:string;
    selected:boolean;
    stage:Stage;
    salesIds:number[];    
}   
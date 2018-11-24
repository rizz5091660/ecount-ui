import { Model } from "./model";
import { SalesOrderDetail } from "./sales_order_detail";
import { Stage } from "./stage";
import { CustomerSupplier } from "./supplier_customer";
import { DropDownModel } from "./drop_down";

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
    nPaid:number;
    nOverdue:number;
    nDraftQ:number;
    nAwApprovalQ:number;
    nAwPaymentQ:number;
    nOverdueQ:number;
    nPaidQ:number;
    referrence:string;
    selected:boolean;
    stage:Stage;
    salesIds:number[];    
    custSupps:DropDownModel[];
    inventories:DropDownModel[];
    soType:string;
    totalAmtDraft:number;
    totalAmtAwApproval:number;
    totalAmtAwPayment:number;
    totalAmtPaid:number;
    totalAmtDraftQ:number;
    totalAmtAwApprovalQ:number;
    totalAmtAwPaymentQ:number;
    totalAmtPaidQ:number;
}   
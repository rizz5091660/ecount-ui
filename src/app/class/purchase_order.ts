import { Model } from "./model";
import { PurchaseOrderDetail } from "./purchase_order_detail";
import { Stage } from "./stage";
import { CustomerSupplier } from "./supplier_customer";
import { DropDownModel } from "./drop_down";

export class PurchaseOrder extends Model{
    poCode:string;
    trxnDate:Date;
    estDeliveryDate:Date;
    totalAmount:number;
    totalTaxAmount:number;
    poType:string;
    suppId:number;
    suppName:string;
    pods:PurchaseOrderDetail[];
    nDraft:number;
    nAwApproval:number;
    nAwPayment:number;
    nOverdue:number;
    referrence:string;
    selected:boolean;
    stage:Stage;
    purchaseIds:number[];    
    custSupps:DropDownModel[];
    inventories:DropDownModel[];
}   
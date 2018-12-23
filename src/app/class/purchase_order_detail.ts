import { Model } from "./model";
import { SelectItem } from "../components/common/api";

export class PurchaseOrderDetail extends Model{
    id:number;
    name:string;
    description:string;   
    quantity:number;
    unitPrice:number;
    taxAmount:number;
    txnAmount:number;
    discount:number;
    inventoryId:number;
    invDD:SelectItem;
    coaDD:SelectItem;
    taxDD:SelectItem;

}
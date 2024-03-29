import { Model } from "./model";
import { SelectItem } from "./selectitem";

export class SalesOrderDetail extends Model{
    id:number;
    name:string;
    description:string;   
    quantity:number;
    unitPrice:number;
    taxAmount:number;
    txnAmount:number;
    discount:number;
    invDD:SelectItem;
    coaDD:SelectItem;
    taxDD:SelectItem;
}
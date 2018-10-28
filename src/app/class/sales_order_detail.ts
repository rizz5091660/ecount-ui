import { Model } from "./model";

export class SalesOrderDetail extends Model{
    quantity:number;
    unitPrice:number;
    taxAmount:number;
    trxnAmount:number;
    discount:number;
    inventoryId:number;
}
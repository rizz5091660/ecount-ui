import { Model } from "./model";

export class SalesOrderDetail extends Model{
    id:number;
    name:string;
    description:string;   
    quantity:number;
    unitPrice:number;
    taxAmount:number;
    trxnAmount:number;
    discount:number;
    inventoryId:number;
}
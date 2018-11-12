import { Model } from "./model";

export class SalesOrderDetail extends Model{
    id:number;
    name:string;
    description:string;   
    quantity:number;
    unitPrice:number;
    taxAmount:number;
    txnAmount:number;
    discount:number;
    inventoryId:number;
}
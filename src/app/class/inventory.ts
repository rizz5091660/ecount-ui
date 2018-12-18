import { Coa } from "./coa";
import { Tax } from "./tax";
import { InventoryBalance } from "./inventory_balance";
import { SelectItem } from "../components/common/selectitem";

export class Inventory{
    id:number;
    name:string;
    unitPriceSales:number;
    unitPricePurchase:number;
    coaSalesId:number;
    taxSalesId:number;
    coaPurchaseId:number;
    taxPurchaseId:number;
    coaSales:Coa;
    taxSales:Tax;
    coaPurchase:Coa;
    taxPurchase:Tax;
    inventories:Inventory[];
    invBalance:InventoryBalance;
    taxes:SelectItem[];
    coas:SelectItem[];
    costCenters:SelectItem[];
    profitCenters:SelectItem[];
    salesFlag:boolean;
    purchaseFlag:boolean;    
}
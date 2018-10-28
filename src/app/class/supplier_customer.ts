import { Address } from "./address";
import { Model } from "./model";

export class CustomerSupplier extends Model{ 
    phone: string;
    email: string;
    isCustomer:number;
    address:Address;
}
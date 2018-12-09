import { Address } from "./address";
import { Model } from "./model";
import { SelectItem } from "./selectitem";

export class CustomerSupplier extends Model{ 
    phone: string;
    email: string;
    type:string;
    address:Address;
    custSupps:CustomerSupplier[];
    countTypes:SelectItem[];
}
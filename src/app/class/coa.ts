import { AccountType } from "./account_type";
import { AccountDetailType } from "./account_detail_type";
import { SelectItem } from "./selectitem";

export class Coa{
    id:number=0;
    name:string;
    description:string; 
    tax:number;
    taxDD:SelectItem;
    taxName:string; 
    coaCd:string;
    taxes: SelectItem[];
    accountTypes: SelectItem[];
    accountDetailTypes: SelectItem[];
    coas:Coa[];
    accountTypeId:number;
    accountDetTypeId:number;
    balance:number;
    asOf:Date;
    accountType:AccountType=new AccountType();
    accountDetailType:AccountDetailType=new AccountDetailType();
}
import { Model } from "./model";
import { SelectItem, SelectItemGroup } from "../components/common/api";
import { AccountType } from "./account_type";
import { CoaBalance } from "./coa_balance";
import { AccountDetailType } from "./account_detail_type";

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
    sigs:SelectItemGroup[];
    coaBalance:CoaBalance;
    accountType:AccountType=new AccountType();
    accountDetailType:AccountDetailType=new AccountDetailType();
}
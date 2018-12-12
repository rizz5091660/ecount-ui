import { Model } from "./model";
import { SelectItem } from "../components/common/api";

export class Coa{
    id:number;
    name:string;
    description:string; 
    l1AccountType:number;
    l1AccountTypeDD:SelectItem;
    l2Branch:number;
    l3CustSupp:number;
    l3CustSuppDD:SelectItem;
    l4Division:number;
    l4DivisionDD:SelectItem;
    l5Custom:number;
    l5CustomDD:SelectItem;
    tax:number;
    taxDD:SelectItem;
    taxName:string; 
    coaCd:string;
    favorite:string;
    l1AccountTypName:string;
    l1AccountTypGrp:string
    taxes: SelectItem[];
    accountTypes: SelectItem[];
    branches: SelectItem[];
    custSupps: SelectItem[];
    divisions: SelectItem[];
    customFields1: SelectItem[];
    coas:Coa[];
}
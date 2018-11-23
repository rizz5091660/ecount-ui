import { DropDownModel } from "./drop_down";
import { Model } from "./model";

export class Coa{
    id:number;
    name:string;
    description:string; 
    l1AccountType:number;
    l1AccountTypeDD:DropDownModel;
    l2Branch:number;
    l3CustSupp:number;
    l3CustSuppDD:DropDownModel;
    l4Division:number;
    l4DivisionDD:DropDownModel;
    l5Custom:number;
    l5CustomDD:DropDownModel;
    tax:number;
    taxDD:DropDownModel;
    taxName:string;
    coaCd:string;
    favorite:string;
    l1AccountTypName:string;
    l1AccountTypGrp:string
    taxes: DropDownModel[];
    accountTypes: DropDownModel[];
    branches: DropDownModel[];
    custSupps: DropDownModel[];
    divisions: DropDownModel[];
    customFields1: DropDownModel[];
}
import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../class/inventory';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { InventoryBalance } from '../../../../class/inventory_balance';
import { Coa } from '../../../../class/coa';
import { Tax } from '../../../../class/tax';
import { HttpResponseWS } from '../../../../class/http_response_ws';
import { SelectItem } from '../../../../components/common/selectitem';
import { ConfirmationService, Message } from '../../../../components/common/api';


@Component({
  selector: 'inventory-search',
  templateUrl: './inventory-search.component.html',
  styleUrls: ['./inventory-search.component.scss']
})
export class InventorySearchComponent implements OnInit {
  msgs: Message[] = [];
  cols: any[];
  model:Inventory;
  inventories:Inventory[];
  display:boolean;
  types:any[];
  httpResponseWS:HttpResponseWS;
  coas:SelectItem[];
  taxes:SelectItem[];

  constructor(private inventoryService:InventoryService,private confirmationService: ConfirmationService, private router:Router) { }

  ngOnInit() {
    this.inventories = [];
    this.cols = [
      { field: 'code', header: 'Code', type: 'txt' },
      { field: 'name', header: 'Name', type: 'txt' },
      { field: 'invBalance.qty', header: 'Quantity', type: 'txt' },
      { field: 'invBalance.balance', header: 'Balance', type: 'txt' },      
      { field: 'unitPricePurchase', header: 'Price Purchase', type: 'txt' },
      { field: 'unitPriceSales', header: 'Price Sales', type: 'txt' },
    ];
    this.types = [
      {label: 'Inventory', value: 'I', icon: 'fa fa-fw fa-cc-paypal'},
      {label: 'Non Inventory', value: 'NI', icon: 'fa fa-fw fa-cc-visa'},
      {label: 'Services', value: 'S', icon: 'fa fa-fw fa-cc-mastercard'}
  ];
    this.initObject();
    this.initData();
  }

  initObject(){
    this.model = new Inventory();
    this.model.invBalance= new InventoryBalance();
    this.model.coaInv = new Coa();
    this.model.coaSales = new Coa();
    this.model.taxSales = new Tax();
    this.model.coaPurchase = new Coa();
    this.model.taxPurchase = new Tax();   
  }

  initData(){
    let modelObsList:Observable<Inventory[]>=this.inventoryService.getAll();
    modelObsList.subscribe((obs)=>{
      this.inventories=obs;
     }
    );

    let modelObs:Observable<Inventory>=this.inventoryService.init();
     modelObs.subscribe((obs)=>{
      this.coas = obs.coas;
      this.taxes = obs.taxes;
     }
    );
  }

  onRowSelect(event){
    let invTemp:Inventory= new Inventory();
    this.inventories.filter(function(inv){
      if(inv.id==event.data.id)
          invTemp = inv;
      }
    );
   this.model= invTemp;
   this.display=true;
  }

  onAdd(){
  this.initObject();  
  this.display=true;
  }

  onSave(){
    if(this.model.id>0){
      this.onUpdate();
    }else{
      this.onCreate();
    }
  }

  onCreate(){
    let httpWSObs:Observable<HttpResponseWS>=this.inventoryService.create(this.model);
    this.onProcessResponse(httpWSObs,"Create");
  }

  onUpdate(){
    let httpWSObs:Observable<HttpResponseWS>=this.inventoryService.update(this.model);
    this.onProcessResponse(httpWSObs,"Update");

  }

  onDelete(){
    let httpWSObs:Observable<HttpResponseWS>=this.inventoryService.delete(this.model.id);
    this.onProcessResponse(httpWSObs,"Delete");
  }

  onDeleteConfirm() {
    this.display = false;
    this.confirmationService.confirm({ 
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDelete();
      },
      reject: () => {
        // this.msgs = [{ severity: 'error', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  onProcessResponse(httpWSObs:Observable<HttpResponseWS>,type:string){
    httpWSObs.subscribe((httpWSObs)=>
    {
      this.httpResponseWS = httpWSObs;
      if(type=="Create"){
        this.model.id=this.httpResponseWS.value;
      }
      this.ngOnInit();
      this.msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Successfully ' + type }];
    },
    error => {
      this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: 'System Error' }];
    }
  );
  this.display=false;
  }
}

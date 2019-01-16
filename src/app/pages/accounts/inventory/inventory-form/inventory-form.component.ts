import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
import { OK_RESP } from '../../../../common/ecount_const';


@Component({
  selector: 'inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {
  @Output() loadData: EventEmitter<null> =   new EventEmitter();
  msgs: Message[] = [];
  model:Inventory;
  display:boolean;
  types:any[];
  coas:SelectItem[];
  taxes:SelectItem[];

  constructor(private inventoryService:InventoryService,private confirmationService: ConfirmationService, private router:Router) { }

  ngOnInit() {
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
    let modelObs:Observable<Inventory>=this.inventoryService.init();
     modelObs.subscribe((obs)=>{
      this.coas = obs.coas;
      this.taxes = obs.taxes;
     }
    );
  }

  onSave(){
    if(this.model.id>0){
      this.onUpdate();
    }else{
      this.onCreate();
    }
  }

  onCancel(){
    this.loadData.emit();
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
      reject: () => {}
    });
  }

  onRowSelect(model:Inventory){
    this.model=model;
  }

  onProcessResponse(httpWSObs:Observable<HttpResponseWS>,type:string){
    let httpResponseWS:HttpResponseWS;
    this.display=false;
    httpWSObs.subscribe((httpWSObs)=>
    {
      httpResponseWS = httpWSObs;
      if (httpResponseWS.status == OK_RESP) {
        this.msgs = [{ severity: 'success', summary: 'Confirmed', detail: httpResponseWS.message }];
      } else {
        this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: httpResponseWS.message }];
      }
    },
    error => {
      this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: httpResponseWS.message }];
    }
  );
  }
}

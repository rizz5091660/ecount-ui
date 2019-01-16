import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../class/inventory';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SelectItem } from '../../../../components/common/selectitem';
import { ConfirmationService, Message } from '../../../../components/common/api';
import { InventoryFormComponent } from '../inventory-form/inventory-form.component';

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
  coas:SelectItem[];
  taxes:SelectItem[];
  @ViewChild(InventoryFormComponent)child:InventoryFormComponent;

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
    this.initData();
  }
  
  initData(){
    let modelObsList:Observable<Inventory[]>=this.inventoryService.getAll();
    modelObsList.subscribe((obs)=>{
      this.inventories=obs;
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
   this.child.onRowSelect(invTemp);
   this.display=true;
  }

  loadDataHandler(count:number){
    this.display=false;
    this.initData();
  }

}

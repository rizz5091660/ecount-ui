import { Component, OnInit } from '@angular/core';
import { Message } from '../../../../components/common/message';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../class/inventory';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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
  modelObs:Observable<Inventory[]>;

  constructor(private inventoryService:InventoryService, private router:Router) { }

  ngOnInit() {
    this.model = new Inventory();
    this.inventories = [];
    this.cols = [
      { field: 'name', header: 'Name', type: 'txt' },
      { field: 'invBalance.qty', header: 'Quantity', type: 'txt' },
      { field: 'invBalance.balance', header: 'Balance', type: 'txt' },      
      { field: 'unitPricePurchase', header: 'Price Purchase', type: 'txt' },
      { field: 'unitPriceSales', header: 'Price Sales', type: 'txt' },
    ];
    this.init();
  }

  init(){
    this.modelObs=this.inventoryService.getAll();
    this.modelObs.subscribe((obs)=>{
      this.inventories=obs;
     }
    );
  }

  onRowSelect(event){
    this.router.navigate(["/pages/accounts/inventory/inventory-form"],{ queryParams: { type: null, stage: null } });
  }

  onAdd(){
    this.router.navigate(["/pages/accounts/inventory/inventory-form"],{ queryParams: { type: null, stage: null } });
  }

}

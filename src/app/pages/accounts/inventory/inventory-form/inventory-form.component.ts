import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../../components/messages/messages';
import { Inventory } from '../../../../class/inventory';
import { Coa } from '../../../../class/coa';
import { Tax } from '../../../../class/tax';
import { InventoryService } from '../../../../service/inventory.service';
import { Observable } from 'rxjs';
import { InventoryBalance } from '../../../../class/inventory_balance';

@Component({
  selector: 'inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {
  msgs:Messages[]=[];
  model:Inventory;
  types:any[];
  modelObs:Observable<Inventory>;
  constructor(private inventoryService:InventoryService) { }

  ngOnInit() {    
    this.model = new Inventory();
    
    this.modelObs=this.inventoryService.init();
    this.model.invBalance= new InventoryBalance();
    this.model.coaSales = new Coa();
    this.model.taxSales = new Tax();
    this.model.coaPurchase = new Coa();
    this.model.taxPurchase = new Tax();
    this.modelObs.subscribe((obs)=>{
      this.model.coas = obs.coas;
      this.model.taxes = obs.taxes;
     }
    );

    this.types = [
      {label: 'Inventory', value: 'I', icon: 'fa fa-fw fa-cc-paypal'},
      {label: 'Non Inventory', value: 'NI', icon: 'fa fa-fw fa-cc-visa'},
      {label: 'Services', value: 'S', icon: 'fa fa-fw fa-cc-mastercard'}
  ];

  }

  onChangeOption(event:any){
    console.log("------> "+event.value);
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseOrder } from '../../../../class/purchase_order';
import { PurchaseService } from '../../../../service/purchase.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { MenuItem } from '../../../../components/common/api';

@Component({
  selector: 'purchase-dashboard',
  templateUrl: './purchase-dashboard.component.html',
  styleUrls: ['./purchase-dashboard.component.scss']
})
export class PurchaseDashboardComponent implements OnInit {
  billRadio ="all";
  poRadio="all";
  observable:Observable<PurchaseOrder>;
  model:PurchaseOrder;
  environment = environment;
  items: MenuItem[];

  constructor(private service:PurchaseService,private router: Router,private calendar: NgbCalendar) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Bill', icon: 'pi pi-file', command: () => {
          this.onAddNew('B');
        }
      },
      {
        label: 'Purchase Order', icon: 'pi pi-refresh', command: () => {
          this.onAddNew('P'); 
        }
      },
    ];
    this.model = new PurchaseOrder();
    this.loadDashboard();
  }
 
  onSelectTab(type,stage){
     this.router.navigate(["../purchase-search"],{ queryParams: { type: type, stage: stage } });
  }

  onAddNew(type:string){
    this.router.navigate(["/pages/accounts/purchase/purchase-form"],{ queryParams: { type: type }} );
  }

  loadDashboard(){
    this.observable = this.service.getPurchaseOrderByStage();
    this.observable.subscribe((observable) =>{
      this.model= observable;
    }
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesOrder } from '../../../../class/sales_order';
import { SalesService } from '../../../../service/sales.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss']
})
export class SalesDashboardComponent implements OnInit {
  invoiceRadio ="all";
  quoteRadio="all";
  observable:Observable<SalesOrder>;
  model:SalesOrder;

  constructor(private service:SalesService,private router: Router) { }

  ngOnInit() {
    this.model = new SalesOrder();
    this.loadDashboard();
  }

  onSelectTab(type,stage){
    console.log("Type: "+type+" Stage: "+stage);
    this.router.navigate(["../sales-search"] );
    //this.router.navigate(["../../sales/sales-search"],{ queryParams: { type: type, stage: stage } });
  }

  loadDashboard(){
    this.observable = this.service.getSalesOrderByStage();
    this.observable.subscribe((observable) =>{
      this.model= observable;
    }
    )
  }
}

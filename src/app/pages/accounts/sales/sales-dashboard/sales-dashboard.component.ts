import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesOrder } from '../../../../class/sales_order';
import { SalesService } from '../../../../service/sales.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';

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
  ngbDateStruct: NgbDateStruct;
  date: {year: number, month: number};
  environment = environment;
  countries: any[];
  selectedCountry: any;


  constructor(private service:SalesService,private router: Router,private calendar: NgbCalendar) { }

  ngOnInit() {
    this.model = new SalesOrder();
    this.loadDashboard();
  }

  selectToday() {
    this.ngbDateStruct = this.calendar.getToday();
  }

  onSelectTab(type,stage){
    console.log("Type: "+type+" Stage: "+stage);
    this.router.navigate(["../sales-search"],{ queryParams: { type: type, stage: stage } });
  }

  onAddNew(type:string){
    this.router.navigate(["/pages/accounts/sales/sales-form"],{ queryParams: { type: type }} );
  }

  loadDashboard(){
    this.observable = this.service.getSalesOrderByStage();
    this.observable.subscribe((observable) =>{
      this.model= observable;
    }
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesOrder } from '../../../../class/sales_order';
import { SalesService } from '../../../../service/sales.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { MenuItem } from '../../../../components/common/api';

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
  items: MenuItem[];

  constructor(private service:SalesService,private router: Router,private calendar: NgbCalendar) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Invoice', icon: 'pi pi-file', command: () => {
          this.onAddNew('I');
        }
      },
      {
        label: 'Quotation', icon: 'pi pi-refresh', command: () => {
          this.onAddNew('Q'); 
        }
      },
    ];
    this.model = new SalesOrder();
    this.loadDashboard();
  }

  selectToday() {
    this.ngbDateStruct = this.calendar.getToday();
  }

  onSelectTab(type,stage){
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

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseOrder } from '../../../../class/purchase_order';
import { PurchaseService } from '../../../../service/purchase.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

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
  ngbDateStruct: NgbDateStruct;
  date: {year: number, month: number};

  constructor(private service:PurchaseService,private router: Router,private calendar: NgbCalendar) { }

  ngOnInit() {
    console.log("START PO");
    this.model = new PurchaseOrder();
    console.log("Model Initialized");
    this.loadDashboard();
  }

  selectToday() {
    this.ngbDateStruct = this.calendar.getToday();
  }

  onSelectTab(type,stage){
    console.log("Type: "+type+" Stage: "+stage);
    this.router.navigate(["../purchase-search"],{ queryParams: { type: type, stage: stage } });
  }

  onAddNew(type:string){
    this.router.navigate(["/pages/accounts/purchase/purchase-form"],{ queryParams: { type: type }} );
  }

  loadDashboard(){
    this.observable = this.service.getPurchaseOrderByStage();
    console.log("Observe: "+this.observable);
    this.observable.subscribe((observable) =>{
      this.model= observable;
    }
    )
  }
}

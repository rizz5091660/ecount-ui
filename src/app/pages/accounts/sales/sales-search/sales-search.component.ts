import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesOrder } from '../../../../class/sales_order';
import { Observable } from 'rxjs';
import { SalesService } from '../../../../service/sales.service';
import { HttpResponseWS } from '../../../../class/http_response_ws';
import { environment } from '../../../../../environments/environment';
import { MenuItem } from '../../../../components/common/menuitem';
import { Stage } from '../../../../class/stage';
import { Message } from '../../../../components/common/message';
import { SalesFormComponent } from '../sales-form/sales-form.component';

@Component({
  selector: 'sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.scss']
})
export class SalesSearchComponent implements OnInit {
  type: string;
  stageId: number;
  saless: SalesOrder[];
  selectedSaless: SalesOrder[] = [];
  salessUpdId: number[];
  sales: SalesOrder;
  obsSos: Observable<SalesOrder[]>;
  obString: Observable<String>;
  obsHttpWS: Observable<HttpResponseWS>;
  httpResponseWS: HttpResponseWS;
  model: SalesOrder;
  environment = environment;
  cols: any[];
  stages:any[];
  stage: any;
  items:MenuItem[];
  display:boolean;
  msgs: Message[] = [];
  tabs =[];
  @ViewChild(SalesFormComponent)child:SalesFormComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesService: SalesService
  ) { }

  ngOnInit() {
    this.initObject();
    this.initData(0,"I");
  }

  initObject(){
    this.tabs = [{ title: 'Invoice', active: true }, { title: 'Quotation', active: false }];
    this.model = new SalesOrder();
    this.items = [
      {label: 'Invoice', icon: 'pi pi-file', command: () => {  this.onAdd('I'); } },
      {label: 'Quotation', icon: 'pi pi-refresh', command: () => {this.onAdd('Q');}},
    ];
    this.cols = [
      { field: 'soCode', header: 'Number', type: 'txt' },
      { field: 'custName', header: 'To', type: 'txt' },
      { field: 'trxnDate', header: 'Date', type: 'txt' },
      { field: 'estDeliveryDate', header: 'Due Date', type: 'txt' },
      { field: 'totalAmount', header: 'Amount', type: 'txt' }
    ]
    this.stages =[
      {name: 'All', stage:0 },
      {name: 'Draft',stage:1 },
      {name: 'Await Approval',stage:2 },
      {name: 'Await Payment', stage:3 },
      {name: 'Paid', stage:4 },
    ];
  }

  initData(stageId: number, type: string) {
    this.obsSos = this.salesService.getSalesOrderAll(stageId, type);
    this.obsSos.subscribe((obsSos) => {
      this.saless = obsSos;
    });

    let obsSo: Observable<SalesOrder> = this.salesService.getSalesOrderByStage();
     obsSo.subscribe((observable) => {
      this.model = observable;
       //riztemp
    this.model.totalAmtPaid=0;
    }
    )
  }

  onAdd(type:string){
    this.child.ngOnInit();
    this.display=true;
    this.type=type;
  }
  onUpdateStage(stageId: number) {
    this.salessUpdId = [];
    for (var i = 0; i < this.selectedSaless.length; i++) {
      this.salessUpdId.push(this.selectedSaless[i].id);
    }
    this.obsHttpWS = this.salesService.updateSalesOrderStage(this.salessUpdId, stageId);
    this.obsHttpWS.subscribe((obsHttpWS) => {
      this.httpResponseWS = obsHttpWS;
      this.selectedSaless = [];
      this.initData(this.stageId, this.type);
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onSelectAll(event: any) {
    for (var i = 0; i < this.saless.length; i++) {
      this.saless[i].selected = event.target.checked;
    }
  }


  onRowSelect(event: any) {
   let so:SalesOrder = event.data;
   this.child.onRowSelect(so);
   this.display=true;


    /*
    if (so != null) {
      so.selected = event.isSelected;
    } else {
      if (event.selected.length == this.saless.length) {
        this.saless.forEach(function (so) {
          so.selected = true;
        });
      } else {
        this.saless.forEach(function (so) {
          so.selected = false;
        });
      }
    }*/

  }

  onStageChange(stage:number,type:string) {
    this.initData(stage, type);
  }

  onTabChange(event: any) {
    if (event.tabTitle == "All") {
      this.stageId = 0;
    }
    else if (event.tabTitle == "Draft") {
      this.stageId = 1;
    }
    else if (event.tabTitle == "Awaiting Approval") {
      this.stageId = 2;
    }
    else if (event.tabTitle == "Awaiting Payment") {
      this.stageId = 3;
    }
    else if (event.tabTitle == "Paid") {
      this.stageId = 4;
    }
  //  this.initData(this.stageId, this.type);
  }

  loadDataHandler(count:number){
    this.display=false;
    this.initData(0,'I');
  }
}

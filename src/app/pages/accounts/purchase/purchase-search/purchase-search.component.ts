import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseOrder } from '../../../../class/purchase_order';
import { Observable } from 'rxjs';
import { PurchaseService } from '../../../../service/purchase.service';
import { HttpResponseWS } from '../../../../class/http_response_ws';
import { environment } from '../../../../../environments/environment';
import { MenuItem } from '../../../../components/common/menuitem';
import { Stage } from '../../../../class/stage';
import { Message } from '../../../../components/common/message';
import { PurchaseFormComponent } from '../purchase-form/purchase-form.component';

@Component({
  selector: 'purchase-search',
  templateUrl: './purchase-search.component.html',
  styleUrls: ['./purchase-search.component.scss']
})
export class PurchaseSearchComponent implements OnInit {
  type: string;
  stageId: number;
  purchases: PurchaseOrder[];
  selectedPurchases: PurchaseOrder[] = [];
  purchasesUpdId: number[];
  purchase: PurchaseOrder;
  obsSos: Observable<PurchaseOrder[]>;
  obString: Observable<String>;
  obsHttpWS: Observable<HttpResponseWS>;
  httpResponseWS: HttpResponseWS;
  model: PurchaseOrder;
  environment = environment;
  cols: any[];
  stages:any[];
  stage: any;
  items:MenuItem[];
  display:boolean;
  msgs: Message[] = [];
  tabs =[];
  @ViewChild(PurchaseFormComponent)child:PurchaseFormComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit() {
    this.initObject();
    this.initData(0,"B");
  }

  initObject(){
    this.tabs = [{ title: 'Bill', active: true }, { title: 'Purchase Order', active: false }];
    this.model = new PurchaseOrder();
    this.items = [
      {label: 'Bill', icon: 'pi pi-file', command: () => {  this.onAdd('B'); } },
      {label: 'Purchase Order', icon: 'pi pi-refresh', command: () => {this.onAdd('P');}},
    ];
    this.cols = [
      { field: 'poCode', header: 'Ref', type: 'txt' },
      { field: 'suppName', header: 'From', type: 'txt' },
      { field: 'trxnDate', header: 'Date', type: 'txt' },
      { field: 'estDeliveryDate', header: 'Due Date', type: 'txt' },
      { field: 'totalAmount', header: 'Paid', type: 'txt' },
      { field: 'stage', header: 'Status', type: 'txt' }
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
    this.obsSos = this.purchaseService.getPurchaseOrderAll(stageId, type);
    this.obsSos.subscribe((obsSos) => {
      this.purchases = obsSos;
    });

    let obsSo: Observable<PurchaseOrder> = this.purchaseService.getPurchaseOrderByStage();
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
    this.purchasesUpdId = [];
    for (var i = 0; i < this.selectedPurchases.length; i++) {
      this.purchasesUpdId.push(this.selectedPurchases[i].id);
    }
    this.obsHttpWS = this.purchaseService.updatePurchaseOrderStage(this.purchasesUpdId, stageId);
    this.obsHttpWS.subscribe((obsHttpWS) => {
      this.httpResponseWS = obsHttpWS;
      this.selectedPurchases = [];
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
    for (var i = 0; i < this.purchases.length; i++) {
      this.purchases[i].selected = event.target.checked;
    }
  }


  onRowSelect(event: any) {
   let po:PurchaseOrder = event.data;
   this.child.onRowSelect(po);
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
    this.initData(0,'B');
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { PurchaseOrder } from '../../../../class/purchase_order';
import { Observable } from 'rxjs';
import { PurchaseService } from '../../../../service/purchase.service';
import { HttpResponseWS } from '../../../../class/http_response_ws';
import { LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'purchase-search',
  templateUrl: './purchase-search.component.html',
  styleUrls: ['./purchase-search.component.scss']
})
export class PurchaseSearchComponent implements OnInit {
  type: string;
  stageId: number;
  purchases: PurchaseOrder[];
  salessUpdId: number[];
  purchase: PurchaseOrder;
  obsPo: Observable<PurchaseOrder>;
  obsPos: Observable<PurchaseOrder[]>;
  obString: Observable<String>;
  obsHttpWS: Observable<HttpResponseWS>;
  httpResponseWS: HttpResponseWS;
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService,
    private _sanitizer: DomSanitizer
  ) { }

  input: string = '<input type="checkbox"></input>';
  settings = {
    selectMode: 'multi',
    actions: {
      edit: false,
      add: false,
      delete: false,
      //custom: [{ name: 'customAction', title: '<i class="ion-document"></i>' }],
      position: 'right',
      select: true,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      soCode: {
        title: 'Number',
        type: 'string',
      },
      referrence: {
        title: 'Referrence',
        type: 'string',
      },
      custName: {
        title: 'To',
        type: 'string',
      },
      trxnDate: {
        title: 'Date',
        type: 'date',
      },
      estDeliveryDate: {
        title: 'Due Date',
        type: 'date',
      },
      totalAmount: {
        title: 'Amount',
        type: 'number',
      },
      select: {

      }
    },
  };

  tabs = [];
  ngOnInit() {

    this.tabs = [{ title: 'All', active: false }, { title: 'Draft', active: false }, { title: 'Awaiting Approval', active: false }, { title: 'Awaiting Payment', active: false }, { title: 'Paid', active: false }];

    this.obString = this.route.queryParamMap.pipe(map(params => params.get('type')));
    this.obString.subscribe((obString) => {
      this.type = obString.toString();
    });

    this.obString = this.route.queryParamMap.pipe(map(params => params.get('stage')));
    this.obString.subscribe((obString) => {
      this.stageId = parseInt(obString.toString());
    });
    this.loadSearch(this.stageId);
  }

  loadSearch(stageId: number) {
    this.obsPos = this.purchaseService.getPurchaseOrderAll(stageId, 'bill');
    this.obsPos.subscribe((obsPos) => {
      this.purchases = obsPos;
      this.source.load(this.purchases);
    });
    for (var i = 0; i < this.tabs.length; i++) {
      if (stageId == i) {
        this.tabs[i].active = true;
      }
    }
  }

  onUpdateStage(stageId: number) {
    this.salessUpdId = [];
    console.log(this.purchases);
    for (var i = 0; i < this.purchases.length; i++) {
      if (this.purchases[i].selected) {
        let po: PurchaseOrder = this.purchases[i];
        this.salessUpdId.push(po.id);
      }
    }
    // this.obsHttpWS = this.salesService.updateSalesOrderStage(this.salessUpdId, stageId);
    // this.obsHttpWS.subscribe((obsHttpWS) => {
    //   this.httpResponseWS = obsHttpWS;
    // });
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

  onCustomAction() {
    console.log("enter custom action");
  }

  onRowSelected(event: any) {
    let po: PurchaseOrder = event.data;
    if (po != null) {
      po.selected = event.isSelected;
    }else{
      if(event.selected.length==this.purchases.length){
        this.purchases.forEach(function(po){
          po.selected=true;
        });
      }else{
        this.purchases.forEach(function(po){
          po.selected=false;
        });
      }
    }
  }

  onTabChange(event: any) {
    console.log("Change tab " + event.tabTitle);
    let stqgedId: number;
    if (event.tabTitle == "All") {
      stqgedId = 0;
    }
    else if (event.tabTitle == "Draft") {
      stqgedId = 1;
    }
    else if (event.tabTitle == "Awaiting Approval") {
      stqgedId = 2;
    }
    else if (event.tabTitle == "Awaiting Payment") {
      stqgedId = 3;
    }
    else if (event.tabTitle == "Paid") {
      stqgedId = 4;
    }
    this.loadSearch(stqgedId);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { SalesOrder } from '../../../../class/sales_order';
import { Observable } from 'rxjs';
import { SalesService } from '../../../../service/sales.service';
import { HttpResponseWS } from '../../../../class/htt_response_ws';
import { LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.scss']
})
export class SalesSearchComponent implements OnInit {
  type: string;
  stageId: number;
  saless: SalesOrder[];
  salessUpdId: number[];
  sales: SalesOrder;
  obsSo: Observable<SalesOrder>;
  obsSos: Observable<SalesOrder[]>;
  obString: Observable<String>;
  obsHttpWS: Observable<HttpResponseWS>;
  httpResponseWS: HttpResponseWS;
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesService: SalesService,
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
    this.loadSearch(this.stageId, this.type);
  }

  loadSearch(stageId: number,type: string) {
    this.obsSos = this.salesService.getSalesOrderAll(stageId, type);
    this.obsSos.subscribe((obsSos) => {
      this.saless = obsSos;
      this.source.load(this.saless);
    });
    for (var i = 0; i < this.tabs.length; i++) {
      if (stageId == i) {
        this.tabs[i].active = true;
      }
    }
  }

  onUpdateStage(stageId: number) {
    this.salessUpdId = [];
    for (var i = 0; i < this.saless.length; i++) {
      if (this.saless[i].selected) {
        let so: SalesOrder = this.saless[i];
        this.salessUpdId.push(so.id);
      }
    }
     this.obsHttpWS = this.salesService.updateSalesOrderStage(this.salessUpdId, stageId);
     this.obsHttpWS.subscribe((obsHttpWS) => {
       this.httpResponseWS = obsHttpWS;
       this.loadSearch(this.stageId, this.type);
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

  onCustomAction() {
    console.log("enter custom action");
  }

  onRowSelected(event: any) {
    let so: SalesOrder = event.data;
    if (so != null) {
      so.selected = event.isSelected;
    }else{
      if(event.selected.length==this.saless.length){
        this.saless.forEach(function(so){
          so.selected=true;
        });
      }else{
        this.saless.forEach(function(so){
          so.selected=false;
        });
      }
    }
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
    this.loadSearch(this.stageId,this.type);
  }
}

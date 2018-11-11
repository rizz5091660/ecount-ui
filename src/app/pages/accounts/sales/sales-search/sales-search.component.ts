import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SalesOrder } from '../../../../class/sales_order';
import { Observable } from 'rxjs';
import { SalesService } from '../../../../service/sales.service';
import { HttpResponseWS } from '../../../../class/htt_response_ws';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.scss']
})
export class SalesSearchComponent implements OnInit {
  type:string;
  stageId:string;
  saless:SalesOrder[];
  salessUpdId:number[]; 
  sales:SalesOrder;
  obsSo:Observable<SalesOrder>;
  obsSos:Observable<SalesOrder[]>;
  obsHttpWS:Observable<HttpResponseWS>;
  httpResponseWS:HttpResponseWS;
  source:LocalDataSource= new LocalDataSource();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesService:SalesService
  ) {}

  settings = {
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
    },
  };
  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
      this.type=params.get('type')
      ),switchMap((params: ParamMap) =>
     this.stageId=params.get('stage')
      ),
    );
    console.log("Type: "+this.type+" Stage: "+this.stageId);
    this.loadSearch(3);
  }

  loadSearch(stageId:number){
    this.obsSos=this.salesService.getSalesOrderAll(stageId,'invoice'); 
    this.obsSos.subscribe((obsSos) => {
      this.saless = obsSos;
      this.source.load(this.saless);
    });
  }

  onUpdateStage(stageId:number){
    this.salessUpdId = [];
    for(var i=0; i<this.saless.length; i++){
        if(this.saless[i].selected){
          let so:SalesOrder = this.saless[i];
          this.salessUpdId.push(so.id);
        }
    }
    this.obsHttpWS=this.salesService.updateSalesOrderStage(this.salessUpdId,stageId);
    this.obsHttpWS.subscribe((obsHttpWS)=>{
      this.httpResponseWS=obsHttpWS;
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onSelectAll(event:any){
    for(var i=0; i<this.saless.length; i++){
      this.saless[i].selected=event.target.checked;
    }
  }

}

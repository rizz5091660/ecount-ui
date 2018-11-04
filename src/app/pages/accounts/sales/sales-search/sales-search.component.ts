import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SalesOrder } from '../../../../class/sales_order';
import { Observable } from 'rxjs';
import { SalesService } from '../../../../service/sales.service';
import { HttpResponseWS } from '../../../../class/htt_response_ws';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesService:SalesService
  ) {}

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

  onSelectAll(event:any){
    for(var i=0; i<this.saless.length; i++){
      this.saless[i].selected=event.target.checked;
    }
  }

}

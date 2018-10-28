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
  stage:string;
  saless:SalesOrder[];
  salessUpd:SalesOrder[]; 
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
      this.type=params.get('type'))
    );
    this.loadSearch();
    console.log("Typeee "+this.type);
  }

  loadSearch(){
    this.obsSos=this.salesService.getSalesOrderAll('draft','invoice'); 
    this.obsSos.subscribe((obsSos) => {
      this.saless = obsSos;
    });
  }

  onApprove(){
    this.salessUpd = [];
    for(var i=0; i<this.saless.length; i++){
        if(this.saless[i].selected){
          let so:SalesOrder = this.saless[i];
          this.salessUpd.push(so);
        }
    }
    this.obsHttpWS=this.salesService.updateSalesOrderStage(this.salessUpd);
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

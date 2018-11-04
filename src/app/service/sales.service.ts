import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SalesOrder } from '../class/sales_order';
import { AppSettings } from '../class/app_settings';
import { HttpResponseWS } from '../class/htt_response_ws';
import { Stage } from '../class/stage';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http:HttpClient) { }
    getSalesOrderByStage():Observable<SalesOrder>{
      return this.http.get<SalesOrder>(AppSettings.get_so_group_stage);
    }
    getSalesOrderAll(stageId:number,type:string):Observable<SalesOrder[]>{ 
      return this.http.get<SalesOrder[]>(AppSettings.get_so_all+"stg="+stageId+"&typ="+type);
    }
    updateSalesOrderStage(salessId:number[],stageId:number):Observable<HttpResponseWS>{
      let so:SalesOrder = new SalesOrder();
      let stg:Stage     = new Stage();
      stg.id = stageId;
      so.salesIds = salessId;
      so.stage=stg;
      return this.http.post<HttpResponseWS>(AppSettings.update_so_stage,so);
    }
}

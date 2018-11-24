import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SalesOrder } from '../class/sales_order';
import { environment } from '../../environments/environment';
import { HttpResponseWS } from '../class/htt_response_ws';
import { Stage } from '../class/stage';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http:HttpClient) { }
    getSalesOrderByStage():Observable<SalesOrder>{
      return this.http.get<SalesOrder>(environment.get_so_group_stage_path);
    }
    getSalesOrderAll(stageId:number,type:string):Observable<SalesOrder[]>{ 
      return this.http.get<SalesOrder[]>(environment.get_so_all_path+"stg="+stageId+"&typ="+type);
    }
    updateSalesOrderStage(salessId:number[],stageId:number):Observable<HttpResponseWS>{
      let so:SalesOrder = new SalesOrder();
      let stg:Stage     = new Stage();
      stg.id = stageId;
      so.salesIds = salessId;
      so.stage=stg;
      return this.http.post<HttpResponseWS>(environment.update_so_stage_path,so);
    }
    create(so:SalesOrder): Observable<HttpResponseWS>{
      return this.http.post<HttpResponseWS>(environment.create_so_path,so);
    }
    init():Observable<SalesOrder>{
      return this.http.get<SalesOrder>(environment.init_so_path);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PurchaseOrder } from '../class/purchase_order';
import { environment } from '../../environments/environment';
import { HttpResponseWS } from '../class/htt_response_ws';
import { Stage } from '../class/stage';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http:HttpClient) { } 
    getPurchaseOrderByStage():Observable<PurchaseOrder>{
      return this.http.get<PurchaseOrder>(environment.get_po_group_stage_path);
    }
    getPurchaseOrderAll(stageId:number,type:string):Observable<PurchaseOrder[]>{ 
      return this.http.get<PurchaseOrder[]>(environment.get_po_all_path+"stg="+stageId+"&typ="+type);
    }
    updatePurchaseOrderStage(purchasesId:number[],stageId:number):Observable<HttpResponseWS>{
      let po:PurchaseOrder = new PurchaseOrder();
      let stg:Stage     = new Stage();
      stg.id = stageId;
      po.purchaseIds = purchasesId;
      po.stage=stg;
      return this.http.post<HttpResponseWS>(environment.update_po_stage_path,po);
    }
    create(po:PurchaseOrder): Observable<HttpResponseWS>{
      return this.http.post<HttpResponseWS>(environment.create_po_path,po);
    }
    init():Observable<PurchaseOrder>{
      return this.http.get<PurchaseOrder>(environment.init_po_path);
    }
}

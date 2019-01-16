import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Inventory } from '../class/inventory';
import { HttpClient } from '@angular/common/http';
import { HttpResponseWS } from '../class/http_response_ws';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Inventory[]>{
    return this.http.get<Inventory[]>(environment.get_all_iventory_path);
  }

  init(): Observable<Inventory>{
    return this.http.get<Inventory>(environment.init_inv_path);
  }

  create(inventory:Inventory): Observable<HttpResponseWS>{
    return this.http.post<HttpResponseWS>(environment.create_inv_path,inventory); 
  }

  update(inventory:Inventory): Observable<HttpResponseWS>{
    return this.http.put<HttpResponseWS>(environment.update_inv_path,inventory);
  }

  delete(id:number): Observable<HttpResponseWS>{
    return this.http.delete<HttpResponseWS>(environment.delete_inv_path+"id="+id);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Inventory } from '../class/inventory';
import { HttpClient } from '@angular/common/http';
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
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpResponseWS } from '../class/http_response_ws';
import { Coa } from '../class/coa';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CoaService {

  constructor(private http: HttpClient) {
  }
 
  init(): Observable<Coa>{
    return this.http.get<Coa>(environment.get_coa_init_path);
  }

  create(coa:Coa): Observable<HttpResponseWS>{
    return this.http.post<HttpResponseWS>(environment.create_coa_path,coa);
  }

  update(coa:Coa): Observable<HttpResponseWS>{
    return this.http.put<HttpResponseWS>(environment.update_coa_path,coa);
  }

  delete(id:number): Observable<HttpResponseWS>{
    return this.http.delete<HttpResponseWS>(environment.delete_coa_path+"id="+id);
  }

}

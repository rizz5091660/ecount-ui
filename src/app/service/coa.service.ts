import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpResponseWS } from '../class/htt_response_ws';
import { AppSettings } from '../class/app_settings';
import { Coa } from '../class/coa';


@Injectable({
  providedIn: 'root'
})
export class CoaService {

  constructor(private http: HttpClient) {
  }

  getCoaAll(accType: string,coaCd: string): Observable<Coa[]> {
    return this.http.get<Coa[]>(AppSettings.get_coa_path + "accType=" + accType+"&coaCd="+coaCd);
  }

  getCoaDropDown(): Observable<Coa> {
    return this.http.get<Coa>(AppSettings.get_coa_drop_down_path);
  }

  create(coa:Coa): Observable<HttpResponseWS>{
    return this.http.post<HttpResponseWS>(AppSettings.create_coa_path,coa);
  }

  update(coa:Coa): Observable<HttpResponseWS>{
    return this.http.put<HttpResponseWS>(AppSettings.update_coa_path,coa);
  }

  delete(id:number): Observable<HttpResponseWS>{
    return this.http.delete<HttpResponseWS>(AppSettings.delete_coa_path+"id="+id);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CustomerSupplier } from '../class/supplier_customer';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpResponseWS } from '../class/http_response_ws';
import { environment } from '../../environments/environment';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};

@Injectable()
export class SupplierService {

    constructor(private http: HttpClient) {
    }
    
     /** GET: fetch list of supplier from database */
    getSupplierAll(isCustomer:string):Observable<CustomerSupplier[]>{
        return this.http.get<CustomerSupplier[]>(environment.get_customer_supplier_path+"isc="+isCustomer);
    }

     /** GET: supplier based on id from database */
     getSupplierById(id:number):Observable<CustomerSupplier>{
        return this.http.get<CustomerSupplier>(environment.get_customer_supplier_byid+"id="+id);
     }

     /** PUT:  modify supplier from database*/
     update(suppCust:CustomerSupplier):Observable<HttpResponseWS>{
        return this.http.post<HttpResponseWS>(environment.update_customer_supplier_path,suppCust);
     }

    /** POST: add a new supplier to the database */
    create(suppCust: CustomerSupplier): Observable<HttpResponseWS> {
        return this.http.post<HttpResponseWS>(environment.create_customer_supplier_path, suppCust);
            // .pipe(
            //     catchError(this.handleError('addHero', suppCust))
            // );
    }

    /** DELETE: delete supplier from database */
    delete(id: number):Observable<HttpResponseWS>{
        return this.http.post<HttpResponseWS>(environment.delete_customer_supplier,id);
    }


    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };
}
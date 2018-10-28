import { CommonErrorResponse } from './CommonErrorResponse';
import { catchError, filter } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const CommonErrorHandler = () => <T>(source: Observable<T>) =>
    source.pipe(catchError(_errorHandler));

const _errorHandler = (errorInput: HttpErrorResponse | any) => {
    let errMsg: string;
    let _status:number;
    let _statusText:string;
    let _body:any;

    if (errorInput instanceof HttpErrorResponse) {
        let err: string = '';
        if (errorInput.error) {
            if (errorInput.error instanceof Object) {
                if (errorInput.error.message) {
                    err = errorInput.error.message;
                } else {
                    err = errorInput.error;
                }
            } else {
                err = errorInput.error;
            }
        }
        _status = errorInput.status;
        _statusText = errorInput.statusText;
        _body = err;
        
        errMsg = `${errorInput.status} - ${errorInput.statusText} ${err}`;

    } else {
        errMsg = errorInput.message ? errorInput.message : '';

        if (errMsg == '') {
            errMsg = errorInput.toString();

            if (errorInput instanceof Object) {                
                errMsg = JSON.stringify(errorInput);
            }
            _body = errMsg;
        }
    }
    console.error(errMsg);

    let errorResponse:CommonErrorResponse = new CommonErrorResponse();
    errorResponse.status = _status;
    errorResponse.body = _body;
    errorResponse.statusText = _statusText;
    return throwError(errorResponse);
}
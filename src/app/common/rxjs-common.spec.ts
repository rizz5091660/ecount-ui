import { CommonErrorResponse } from './CommonErrorResponse';
import { CommonErrorHandler } from './rxjs-common';
import { TestBed, getTestBed } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('RxJS-Common Test cases', () => {
  let controller: HttpTestingController;
  let client:HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],providers: [
        HttpClient
      ]
    });
    let injector = getTestBed();
    controller = injector.get(HttpTestingController);
    client = injector.get(HttpClient);
  })

  it('CommonErrorHandler --> should return CommonErrorResponse in error callback', (done) => {
    let url:string = 'http://raisha';
    client.get(url).pipe(CommonErrorHandler()).subscribe(
      (succ) => {
        console.log('successz');
        fail('Should not come to this section');
        done();
      },
      (err) => {        
        console.log(err);
        if(err instanceof CommonErrorResponse){
          expect(err).toBeDefined();
          expect(err.body).toBe('Error Thrown');
          expect(err.status).toBe(300);
          expect(err.statusText).toBe('Fortuna_Error');
        }
        done();
      }
    )
    controller.expectOne(req => {
      return req.url === url
    }).flush('Error Thrown', {status: 300, statusText: 'Fortuna_Error'});
  })
})
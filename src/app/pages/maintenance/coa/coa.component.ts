import { Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Coa } from '../../../class/coa';
import { CoaService } from '../../../service/coa.service';
import { HttpResponseWS } from '../../../class/http_response_ws';
import { DropDownModel } from '../../../class/drop_down';
import { SelectItem, ConfirmationService, Message } from '../../../components/common/api';

@Component({
  selector: 'coa',
  templateUrl: './coa.component.html',
  styleUrls: ['./coa.component.scss']
})


export class CoaComponent implements OnInit {
  radioModel = 'all';
  observables: Observable<Coa[]>;
  observable: Observable<Coa>;
  accountType: number;
  model: Coa = new Coa();
  modelDD: Coa = new Coa();
  closeResult: string;
  httpRespObservable: Observable<HttpResponseWS>;
  coaCode: string;
  selectedTaxId: string;
  display: boolean = false;
  cols: any[]; 
  msgs: Message[] = [];

  constructor(private service: CoaService,private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.cols = [
      { field: 'l1AccountTypName', header: 'Account Type', type: 'txt' },
      { field: 'coaCd', header: 'Code', type: 'txt' },
      { field: 'name', header: 'Name', type: 'txt' },
      { field: 'description', header: 'Description', type: 'txt' },
      { field: 'taxName', header: 'Tax Type', type: 'txt' },
     // { field: '', header: 'Action', type: 'btn' },
    ];
    this.init();
  }

  init() {
    this.observable = this.service.init();
    this.observable.subscribe((observable) => {
      this.modelDD = observable;
    })
  }

  onAdd(){
    this.display = true;
    this.model = new Coa();
    this.model.id=0;
  }

  onRowSelect(event){
    this.model= event.data;
    this.display = true;
  }

  onSubmit() {
    if (this.model.id != 0) {
     this.onUpdate();
    } else {
      this.onCreate();
    }
  }

  onCreate() {
    this.httpRespObservable = this.service.create(this.model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      this.onProcessSuccessResponse(httpRespObservable, 'Create');
    }, 
    error => {
      this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: 'System Error' }];
    })
  }

  onUpdate() {
    this.httpRespObservable = this.service.update(this.model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      this.onProcessSuccessResponse(httpRespObservable, 'Update');
    }, 
    error => {
      this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: 'System Error' }];
    })
  }

  onDelete() {
    this.httpRespObservable = this.service.delete(this.model.id);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      this.onProcessSuccessResponse(httpRespObservable,'Delete');  
    }, 
    error => {
      this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: 'System Error' }];
    });
  }

  onDeleteConfirm() {
    this.display=false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDelete();
      },
      reject: () => {;
      }
    });
  }

  onProcessSuccessResponse(httpRespObservable:HttpResponseWS, type:string){
    this.display=false;
    this.init();
    this.msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Successfully '+type }];
}

}

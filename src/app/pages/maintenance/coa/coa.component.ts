import { Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Coa } from '../../../class/coa';
import { CoaService } from '../../../service/coa.service';
import { HttpResponseWS } from '../../../class/http_response_ws';
import { ConfirmationService, Message, SelectItemGroup } from '../../../components/common/api';
import { CoaBalance } from '../../../class/coa_balance';
import { SelectItem } from '../../../class/selectitem';

@Component({
  selector: 'coa',
  templateUrl: './coa.component.html',
  styleUrls: ['./coa.component.scss']
})


export class CoaComponent implements OnInit {
  radioModel = 'all';
  model: Coa = new Coa();
  coas:Coa[];
  display: boolean = false;
  cols: any[]; 
  msgs: Message[] = [];
  accTypeDD: SelectItem[];
  accDetTypeDDAll: SelectItem[];
  accDetTypeDD: SelectItem[];
  

  constructor(private service: CoaService,private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.initObject();
    this.initData();
  }

  initObject(){
    this.model = new Coa();
    this.cols = [
      { field: 'accountType.name', header: 'Account', type: 'txt' },
      { field: 'accountDetailType.name', header: 'Detail Account', type: 'txt' },      
      { field: 'name', header: 'Name', type: 'txt' },
      { field: 'description', header: 'Description', type: 'txt' },
      { field: 'taxName', header: 'Tax Type', type: 'txt' },
    ];
  }

  initData() {
    let observable: Observable<Coa> = this.service.init();
    observable.subscribe((observable) => {
      this.coas = observable.coas;
      this.accTypeDD = observable.accountTypes;
      this.accDetTypeDDAll = observable.accountDetailTypes;
    })
  }

  onAdd(){
    this.display = true;
    this.model = new Coa();
  }

  onRowSelect(event){
    let coaTemp:Coa= new Coa();
    let accDetTypeDDTmp: SelectItem[] = [];
    this.coas.filter(function(coa){
      if(coa.id==event.data.id)
        coaTemp = coa;
      }
    );
   this.model= coaTemp;
   this.accDetTypeDDAll.filter(function(accDet){
    if(accDet.value2==coaTemp.accountType.id)
        accDetTypeDDTmp.push(accDet);    
      }
    );
   this.accDetTypeDD = accDetTypeDDTmp;
   this.display=true;
  }

  onChangeAccTypeDD(accTypeDD:any){
    let accDetTypeDDTmp: SelectItem[]=[];
    this.accDetTypeDDAll.filter(function(accDet){
        if(String(accDet.value2)==String(accTypeDD.value)){
          accDetTypeDDTmp.push(accDet);
        }
      }
    );
    this.accDetTypeDD= accDetTypeDDTmp;
  }

  onSave() {
    if (this.model.id != 0) { this.onUpdate(); } 
    else { this.onCreate(); }
  }

  onCreate() {
    let httpRespObservable: Observable<HttpResponseWS> = this.service.create(this.model);
    this.onProcessResponse(httpRespObservable,"Create");
  }

  onUpdate() {
    let httpRespObservable: Observable<HttpResponseWS> = this.service.update(this.model);
    this.onProcessResponse(httpRespObservable,"Update");
  }

  onDelete() {
    let httpRespObservable: Observable<HttpResponseWS> = this.service.delete(this.model.id);
    this.onProcessResponse(httpRespObservable,"Delete");
  }

  onProcessResponse(httpRespObservable: Observable<HttpResponseWS>, type:string){
    let httpResponseWS:HttpResponseWS;
    httpRespObservable.subscribe((httpRespObservable) => {
      httpResponseWS = httpRespObservable;
      this.msgs = [{ severity: 'success', summary: 'Confirmed', detail: httpResponseWS.message }];
      this.initData();
    }, 
    error => {
      this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: 'System Error' }];
    })
    this.display=false;
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



}

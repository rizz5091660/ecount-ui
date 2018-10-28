import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { Coa } from '../../../class/coa';
import { CoaService } from '../../../service/coa.service';
import { HttpResponseWS } from '../../../class/htt_response_ws';

@Component({
  selector: 'coa',
  templateUrl: './coa.component.html',
  styleUrls: ['./coa.component.scss']
})
export class CoaComponent implements OnInit {
  radioModel  = 'all';
  observables : Observable<Coa[]>;
  observable : Observable<Coa>;
  coas : Coa[];
  accountType:number;
  model:Coa;
  modelDD:Coa;
  closeResult:string;
  httpRespObservable:Observable<HttpResponseWS>;
  coaCode:string;

  constructor(private modalService : NgbModal, private service : CoaService ) { }

  ngOnInit() {
    this.loadListCoa('all','');  
    this.loadCoaDD();
  }

  loadListCoa(accType,coaCode){
    this.observables = this.service.getCoaAll(accType,coaCode); 
    this.observables.subscribe((listObservable) => {
      this.coas = listObservable;
    })
  }

  loadCoaDD(){
    this.observable = this.service.getCoaDropDown(); 
    this.observable.subscribe((observable) => {
      this.modelDD = observable;
    })
  }

  onSubmit(){
    if(this.model.id==null){
      this.onCreate();
    }else{
      this.onUpdate();
    }

  }

  onCreate(){
    console.log(this.model);
    this.httpRespObservable = this.service.create(this.model);
    this.httpRespObservable.subscribe((httpRespObservable)=>{
      console.log(httpRespObservable.status);
    })
  }

  onUpdate(){
    this.httpRespObservable = this.service.update(this.model);
    this.httpRespObservable.subscribe((httpRespObservable)=>{
      console.log(httpRespObservable.status);
    })
  }

  onEdit(modal,coa:Coa){
    this.openModal(modal);
    this.model = coa;
  }
     
  onDelete(id:number){
    this.httpRespObservable = this.service.delete(id);
    this.httpRespObservable.subscribe((httpRespObservable)=>{
      console.log(httpRespObservable.status);
    });
  }

  onChange(value) {
    console.log(value);
   }

  onSelectTab(val){
    this.loadListCoa(val,'');
  }

  openModal(modal) {
    this.model = new Coa();
    this.modalService.open(modal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

 

}

import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { Coa } from '../../../class/coa';
import { CoaService } from '../../../service/coa.service';
import { HttpResponseWS } from '../../../class/htt_response_ws';
import { DropDownModel } from '../../../class/drop_down';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'coa',
  templateUrl: './coa.component.html',
  styleUrls: ['./coa.component.scss']
})
export class CoaComponent implements OnInit {
  radioModel  = 'all';
  observables : Observable<Coa[]>;
  observable : Observable<Coa>;
  coas : Coa[]
  accountType:number;
  model:Coa = new Coa();
  modelDD:Coa = new Coa();
  closeResult:string;
  httpRespObservable:Observable<HttpResponseWS>;
  coaCode:string;
  source:LocalDataSource = new LocalDataSource();

  constructor(private modalService : NgbModal, private service : CoaService ) { }

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },    
    columns: {
      l1AccountTypName: {
        title: 'Account Type',
        type: 'string',
      },
      coaCd: {
        title: 'Code',
        type: 'string',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      taxName: {
        title: 'Tax Type',
        type: 'string',
      }
    },
  };

  ngOnInit() {
    this.loadListCoa('all','');  
    this.loadCoaDD();
  }

  loadListCoa(accType,coaCode){
    this.observables = this.service.getCoaAll(accType,coaCode); 
    this.observables.subscribe((listObservable) => {
      this.coas = listObservable;
      this.source.load(this.coas);
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
    let typeDD:DropDownModel=this.modelDD.accountTypes.find(i=>i.id ==String(this.model.l1AccountType));
    let taxDD:DropDownModel =this.modelDD.taxes.find(i=>i.id==String(this.model.tax));
    this.model.l1AccountTypName = typeDD.name;
    this.model.taxName = taxDD.name;
    this.httpRespObservable = this.service.create(this.model);
    this.httpRespObservable.subscribe((httpRespObservable)=>{
      //console.log(httpRespObservable.status);
      this.coas.push(this.model);
      this.source.load(this.coas);
    })
  }

  onUpdate(){
    this.httpRespObservable = this.service.update(this.model);
    this.httpRespObservable.subscribe((httpRespObservable)=>{
     // console.log(httpRespObservable.status);
    })
  }

  onEdit(event): void{
    // this.openModal(modal);
    // this.model = coa;
    console.log("Supp");
  }

  onEdit2(event): void{
    console.log(event);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.onDelete(event.data);
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
     
  onDelete(coa:Coa){
    this.httpRespObservable = this.service.delete(coa.id);
    this.httpRespObservable.subscribe((httpRespObservable)=>{
     // console.log(httpRespObservable.status);
      this.coas.splice(this.coas.indexOf(coa),1);
      this.source.load(this.coas);
    });
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

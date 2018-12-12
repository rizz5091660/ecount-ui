import { Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Coa } from '../../../class/coa';
import { CoaService } from '../../../service/coa.service';
import { HttpResponseWS } from '../../../class/http_response_ws';
import { DropDownModel } from '../../../class/drop_down';
import { SelectItem } from '../../../components/common/api';

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

  constructor(private service: CoaService) { }

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
  }

  onRowSelect(event){
    this.display = true;
    this.model= event.data;
  }

  onSubmit() {
    if (this.model.id == null) {
      this.onCreate();
    } else {
      this.onUpdate();
    }

  }

  onCreate() {
    /*

    let typeDD: SelectItem = this.modelDD.accountTypes.find(i => i.id == String(this.model.l1AccountType));
    let taxDD: SelectItem = this.modelDD.taxes.find(i => i.id == String(this.model.tax));
    this.model.l1AccountTypName = typeDD.name;
    this.model.taxName = taxDD.name;
    this.httpRespObservable = this.service.create(this.model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      this.coas.push(this.model);
    })

    */
  }

  onUpdate() {
    this.httpRespObservable = this.service.update(this.model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      // console.log(httpRespObservable.status);
    })
  }


  onDelete(coa: Coa) {
    this.httpRespObservable = this.service.delete(coa.id);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      // console.log(httpRespObservable.status);
      //this.coas.splice(this.coas.indexOf(coa), 1);
    });
  }


}

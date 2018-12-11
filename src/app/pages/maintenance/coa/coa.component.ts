import { Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Coa } from '../../../class/coa';
import { CoaService } from '../../../service/coa.service';
import { HttpResponseWS } from '../../../class/http_response_ws';
import { DropDownModel } from '../../../class/drop_down';

@Component({
  selector: 'coa',
  templateUrl: './coa.component.html',
  styleUrls: ['./coa.component.scss']
})


export class CoaComponent implements OnInit {
  radioModel = 'all';
  observables: Observable<Coa[]>;
  observable: Observable<Coa>;
  coas: Coa[];
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
      { field: 'coaCd', header: 'Code', type: 'txt' },
      { field: 'name', header: 'Name', type: 'txt' },
      { field: 'description', header: 'Description', type: 'txt' },
      { field: 'taxName', header: 'Tax Type', type: 'txt' },
     // { field: '', header: 'Action', type: 'btn' },
    ];
    this.loadListCoa('all', '');
    this.loadCoaDD();
  }

  loadListCoa(accType, coaCode) {
    this.observables = this.service.getCoaAll(accType, coaCode);
    this.observables.subscribe((listObservable) => {
      this.coas = listObservable;
    })
  }

  loadCoaDD() {
    this.observable = this.service.getCoaDropDown();
    this.observable.subscribe((observable) => {
      this.modelDD = observable;
    })
  }

  onAdd(){
    this.display = true;
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
    let typeDD: DropDownModel = this.modelDD.accountTypes.find(i => i.id == String(this.model.l1AccountType));
    let taxDD: DropDownModel = this.modelDD.taxes.find(i => i.id == String(this.model.tax));
    this.model.l1AccountTypName = typeDD.name;
    this.model.taxName = taxDD.name;
    this.httpRespObservable = this.service.create(this.model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      //console.log(httpRespObservable.status);
      this.coas.push(this.model);
    })
  }

  onUpdate() {
    this.httpRespObservable = this.service.update(this.model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      // console.log(httpRespObservable.status);
    })
  }


  onCustom(event: any) {
    if (event.action == "onEdit") {
     // this.model = event.data;
      this.model.tax = event.data.id;

      this.model.taxDD = new DropDownModel();
      this.model.taxDD.id = "1";
      this.model.taxDD.name = "Sales Tax";;

    }
    else if (event.action == "onDelete") {
      this.onDelete(event.data);
    }
  }


  onDelete(coa: Coa) {
    this.httpRespObservable = this.service.delete(coa.id);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      // console.log(httpRespObservable.status);
      this.coas.splice(this.coas.indexOf(coa), 1);
    });
  }


  selectionChanged(event: any, type: string) {
    if (type == 'l1AccountType' && event.value[0] != null) {
      this.model.l1AccountType = event.value[0].id;
    }
    else if (type == 'l2Branch' && event.value[0] != null) {
      this.model.l2Branch = event.value[0].id;
    }
    else if (type == 'l3CustSupp' && event.value[0] != null) {
      this.model.l3CustSupp = event.value[0].id;
    }
    else if (type == 'l4Division' && event.value[0] != null) {
      this.model.l4Division = event.value[0].id;
    }
    else if (type == 'tax' && event.value[0] != null) {
      this.model.tax = event.value[0].id;
    }
  }

  onSelectTab(val) {
    this.loadListCoa(val, '');
  }

  openModalAdd() {
    this.model = new Coa();
 
  }



}

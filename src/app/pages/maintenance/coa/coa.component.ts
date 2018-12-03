import { Component, OnInit, ViewChild, ElementRef, ViewChildren, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { Coa } from '../../../class/coa';
import { CoaService } from '../../../service/coa.service';
import { HttpResponseWS } from '../../../class/http_response_ws';
import { DropDownModel } from '../../../class/drop_down';
import { LocalDataSource } from 'ng2-smart-table';
import * as $ from "jquery";

@Component({
  selector: 'coa',
  templateUrl: './coa.component.html',
  styleUrls: ['./coa.component.scss']
})


export class CoaComponent implements OnInit {
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('ddtRef') private ddtRef: any;
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
  source: LocalDataSource = new LocalDataSource();
  selectedTaxId: string;

  constructor(private modalService: NgbModal, private service: CoaService) { }

  settings = {
    mode: 'external',
    actions: {
      edit: false,
      delete: false,
      custom: [{ name: 'onEdit', title: '<i class="nb-edit"></i>' }, { name: 'onDelete', title: '<i class="nb-trash"></i>' }],
      position: 'right',
    },
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



  

  config = {
    displayKey: "name", //if objects array passed which key to be displayed defaults to description,
    search: true, //enables the search plugin to search in the list
    multiple: false
  };

  ngOnInit() {
    $(document).ready(function () {
      $(".ng2-smart-action-add-add").click(function () {
        $("#newBtn").click();
      });
    });
    this.loadListCoa('all', '');
    this.loadCoaDD();
  }

  loadListCoa(accType, coaCode) {
    this.observables = this.service.getCoaAll(accType, coaCode);
    this.observables.subscribe((listObservable) => {
      this.coas = listObservable;
      this.source.load(this.coas);
    })
  }

  loadCoaDD() {
    this.observable = this.service.getCoaDropDown();
    this.observable.subscribe((observable) => {
      this.modelDD = observable;
    })
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
      this.source.load(this.coas);
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
      this.openModal(this.modal);
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
      this.source.load(this.coas);
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
    this.openModal(this.modal);
  }

  openModal(modal) {
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

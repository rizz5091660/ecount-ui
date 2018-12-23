import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../service/supplier.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { CustomerSupplier } from '../../../class/supplier_customer';
import { Address } from '../../../class/address';
import { HttpResponseWS } from '../../../class/http_response_ws';
import { Message, ConfirmationService } from '../../../components/common/api';
import { SelectItem } from '../../../class/selectitem';


@Component({
  selector: 'list',
  templateUrl: './supplier_list.component.html',
  styleUrls: ['./supplier_list.component.scss']
})
export class SupplierListComponent implements OnInit {
  model: CustomerSupplier = new CustomerSupplier();
  custSupps: CustomerSupplier[] = [];
  selectedItem: SelectItem = new SelectItem();
  countTypes: SelectItem[];
  msgs: Message[] = [];
  cols: any[];
  display: boolean = false;

  constructor(private router: Router, private supplierService: SupplierService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.model = new CustomerSupplier();
    this.model.address = new Address();
    this.selectedItem.value = 'all';
    this.init();
    this.cols = [
      { field: 'name', header: 'Name', type: 'txt' },
      { field: 'phone', header: 'Phone', type: 'txt' },
      { field: 'email', header: 'Email', type: 'txt' },
      { field: 'address.street', header: 'Address', type: 'txt' },
      // { field: '', header: 'Action', type: 'btn' },
    ];
  }

  init() {
    let modelObs: Observable<CustomerSupplier> = this.supplierService.init();
    modelObs.subscribe((obs) => {
      this.custSupps = obs.custSupps;
      this.countTypes = obs.countTypes;
    })
  }
  
  loadContacts() {
    let listObservable: Observable<CustomerSupplier[]> = this.supplierService.getSupplierAll(this.selectedItem.value);
    listObservable.subscribe((listObservable) => {
      this.custSupps = listObservable;
    })
  }
  onAdd() {
    this.model = new CustomerSupplier();
    this.model.address = new Address();
    this.model.id = 0;
    this.display = true;
  }
  onRowSelect(event) {
    this.model = event.data;
    this.display = true;
  }
  onSubmit() {
    if (this.model.id == 0) {
      this.onCreate();
    } else {
      this.onUpdate();
    }
  }
  onCreate() {
    let httpRespObservable: Observable<HttpResponseWS> =  this.supplierService.create(this.model);
    this.onProcessResponse(httpRespObservable,"Create");
  }

  onUpdate() {
    let httpRespObservable: Observable<HttpResponseWS> = this.supplierService.update(this.model);
    this.onProcessResponse(httpRespObservable,"Update");
  }

  onDelete() {
    let httpRespObservable: Observable<HttpResponseWS> = this.supplierService.delete(this.model.id);
    this.onProcessResponse(httpRespObservable,"Delete");
  }

  onProcessResponse(httpRespObservable: Observable<HttpResponseWS>,type:string){
    httpRespObservable.subscribe((httpRespObservable) => {
      this.display = false;
      this.init();
      this.msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Successfully ' + type }];
    },
      error => {
        this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: 'System Error' }];
      }
    );
  }


  onDeleteConfirm() {
    this.display = false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDelete();
      },
      reject: () => {
        this.display = false;
      }
    });
  }

}

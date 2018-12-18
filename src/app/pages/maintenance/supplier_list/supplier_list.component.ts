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
  listObservable: Observable<CustomerSupplier[]>;
  modelObs: Observable<CustomerSupplier>;
  model: CustomerSupplier = new CustomerSupplier();
  custSupps: CustomerSupplier[] = [];
  httpRespObservable: Observable<HttpResponseWS>;
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
    this.modelObs = this.supplierService.init();
    this.modelObs.subscribe((obs) => {
      this.custSupps = obs.custSupps;
      this.countTypes = obs.countTypes;
    })
  }
  
  loadContacts() {
    this.listObservable = this.supplierService.getSupplierAll(this.selectedItem.value);
    this.listObservable.subscribe((listObservable) => {
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
    this.httpRespObservable = this.supplierService.create(this.model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      this.onProcessSuccessResponse(httpRespObservable, 'Create');
    },
      error => {
        this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: 'System Error' }];
      });
  }

  onUpdate() {
    this.httpRespObservable = this.supplierService.update(this.model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      this.onProcessSuccessResponse(httpRespObservable, 'Update');
    },
      error => {
        this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: 'System Error' }];
      });
  }


  onDelete() {
    this.httpRespObservable = this.supplierService.delete(this.model.id);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      this.onProcessSuccessResponse(httpRespObservable, 'Delete');
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
        // this.msgs = [{ severity: 'error', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  onProcessSuccessResponse(httpRespObservable: HttpResponseWS, type: string) {
    this.display = false;
    this.init();
    this.msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Successfully ' + type }];
  }
}

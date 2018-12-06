import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SupplierService } from '../../../service/supplier.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { CustomerSupplier } from '../../../class/supplier_customer';
import { Address } from '../../../class/address';
import { ModalComponent } from '../../shares/modals/modal/modal.component';
import { HttpResponseWS } from '../../../class/http_response_ws';
import * as $ from "jquery";
import { Message, ConfirmationService } from '../../../components/common/api';


@Component({
  selector: 'list',
  templateUrl: './supplier_list.component.html',
  styleUrls: ['./supplier_list.component.scss']
})
export class SupplierListComponent implements OnInit {
  @ViewChild('modal') modal: ElementRef;
  listObservable: Observable<CustomerSupplier[]>;
  customerSuppliers: CustomerSupplier[];
  closeResult: string;
  model: CustomerSupplier = new CustomerSupplier();
  httpRespObservable: Observable<HttpResponseWS>;
  source: LocalDataSource = new LocalDataSource();
  id: number;

  msgs: Message[] = [];
  cols: any[];
  display: boolean = false;

  ngOnInit() {
    this.model= new CustomerSupplier();
    this.model.address = new Address();
    this.loadListSupplier();
    this.cols = [
      { field: 'name', header: 'Name', type: 'txt' },
      { field: 'phone', header: 'Phone', type: 'txt' },
      { field: 'email', header: 'Email', type: 'txt' },
      { field: 'address.street', header: 'Street', type: 'txt' },
      { field: 'address.city', header: 'City', type: 'txt' },
      { field: 'address.state', header: 'State', type: 'txt' },
      { field: 'address.zip', header: 'Zip', type: 'txt' },
      { field: 'address.country', header: 'Country', type: 'txt' },
      { field: '', header: 'Action', type: 'btn' },
    ];


  }
  constructor(private router: Router, private service: SupplierService, private modalService: NgbModal, private supplierService: SupplierService, private confirmationService: ConfirmationService) { }


  onAdd() {
    this.display = true;
    this.model.address = new Address();
  }

  loadListSupplier() {
    this.listObservable = this.service.getSupplierAll('0');
    this.listObservable.subscribe((listObservable) => {
      this.customerSuppliers = listObservable;
      this.source.load(this.customerSuppliers);
    })
  }

  onSubmit() {
    if (this.model.id == null) {
      this.onCreate();
    } else {
      this.onUpdate();
    }
    this.loadListSupplier();
  }

  openModalAdd() {
    this.openModal(this.modal);
  }

  openModal(modal) {
    this.model = new CustomerSupplier();
    this.model.address = new Address();
    this.modalService.open(modal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onEdit(modal, model) {
    this.openModal(modal);
    this.model = model;
  }

  onCreate() {
    this.httpRespObservable = this.supplierService.create(this.model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      // console.log(httpRespObservable.status);
      this.customerSuppliers.push(this.model);
      this.source.load(this.customerSuppliers);
    });

  }

  onUpdate() {
    this.httpRespObservable = this.supplierService.update(this.model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      console.log(httpRespObservable.status);
    });
  }


  onDeleteConfirm(id: number) {
    this.id = id;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'You have accepted' }];
        this.onDelete();
      },
      reject: () => {
        this.msgs = [{ severity: 'error', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  onDelete() {
    this.httpRespObservable = this.supplierService.delete(this.id);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      console.log(this.httpRespObservable);
    });
    this.loadListSupplier();
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

  showLargeModal() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Large Modal';
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}

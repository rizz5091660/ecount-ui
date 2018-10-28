import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartTableService } from '../../../@core/data/smart-table.service';
import { SupplierService } from '../../../service/supplier.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { CustomerSupplier } from '../../../class/supplier_customer';
import { Address } from '../../../class/address';
import { ModalComponent } from '../../shares/modals/modal/modal.component';
import { HttpResponseWS } from '../../../class/htt_response_ws';

@Component({ 
  selector: 'list',
  templateUrl: './supplier_list.component.html',
  styleUrls: ['./supplier_list.component.scss']
})
export class SupplierListComponent implements OnInit {
  listObservable: Observable<CustomerSupplier[]>;
  listCustomerSupplier: CustomerSupplier[];
  closeResult: string;
  model = new CustomerSupplier();
  httpRespObservable:Observable<HttpResponseWS>;

  ngOnInit() {
    this.model.address = new Address();
  }

  constructor(private router: Router, private service: SupplierService, private modalService: NgbModal, private supplierService: SupplierService) {
    this.loadListSupplier();
  }

  loadListSupplier() {
    this.listObservable = this.service.getSupplierAll('0');
    this.listObservable.subscribe((listObservable) => {
      this.listCustomerSupplier = listObservable;
    })
  }


  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onSubmit() {
    if(this.model.id==null){
      this.onCreate();
    }else{
      this.onUpdate();
    }
    this.loadListSupplier();
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

  onCreate(){
    this.httpRespObservable = this.supplierService.create(this.model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      console.log(httpRespObservable.status);
    });

  }

  onUpdate(){
   this.httpRespObservable = this.supplierService.update(this.model);
   this.httpRespObservable.subscribe((httpRespObservable) => {
    console.log(httpRespObservable.status);
   }); 
  }
  
  onDelete(model: CustomerSupplier){
    this.httpRespObservable = this.supplierService.delete(model);
    this.httpRespObservable.subscribe((httpRespObservable) => {
      console.log(httpRespObservable.status);
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

  showLargeModal() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Large Modal';
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}

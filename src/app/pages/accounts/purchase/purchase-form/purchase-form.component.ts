import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PurchaseOrder } from '../../../../class/purchase_order';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseOrderDetail } from '../../../../class/purchase_order_detail';
import { PurchaseService } from '../../../../service/purchase.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponseWS } from '../../../../class/http_response_ws';
import { Stage } from '../../../../class/stage';
import { CustomerSupplier } from '../../../../class/supplier_customer';
import { DropDownModel } from '../../../../class/drop_down';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';
import * as $ from "jquery";
import { Address } from '../../../../class/address';

@Component({
  selector: 'purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent implements OnInit {
  @ViewChild('modal') modal: ElementRef;
  model:PurchaseOrder = new PurchaseOrder();
  modelPod:PurchaseOrderDetail = new PurchaseOrderDetail();
  trxnDtNgb: NgbDateStruct;
  dueDtNgb: NgbDateStruct;
  subTotal:number;  
  obHttp:Observable<HttpResponseWS>;
  obPo:Observable<PurchaseOrder>;
  custDD:DropDownModel=new DropDownModel();
  obPurchaseTyp:Observable<string>;
  purchaseTyp:string;
  source:LocalDataSource = new LocalDataSource();
  closeResult:string;

  constructor(private service:PurchaseService,private route: ActivatedRoute, private modalService: NgbModal) { }

  config = {
    displayKey:"name", //if objects array passed which key to be displayed defaults to description,
    search:true, //enables the search plugin to search in the list
    multiple:false
    };

    settings = {
      mode : 'external',
      actions: {
        edit: false,
        delete: false,
        custom: [{ name: 'onEdit', title: '<i class="nb-edit"></i>' },{ name: 'onDelete', title: '<i class="nb-trash"></i>' }],
        position : 'right',
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
        name: {
          title: 'Name',
          type: 'string',
        },
        quantity: {
          title: 'Quantity',
          type: 'number',
        },
        unitPrice: {
          title: 'Price',
          type: 'number',
        },
        taxAmount: {
          title: 'Tax',
          type: 'number',
        },
        txnAmount: {
          title: 'Amount',
          type: 'number',
        },
      },
    };

  ngOnInit() {

    $(document).ready(function(){
      $(".ng2-smart-action-add-add").click(function(){
            $("#newBtn").click();  
          });
      });
      this.modelPod = new PurchaseOrderDetail();
      this.model.pods=[];
      this.source.load(this.model.pods);      

      this.obPo=this.service.init();
      this.obPo.subscribe((observable) =>{
        this.model.custSupps=observable.custSupps;
        this.model.inventories=observable.inventories;
      });

      this.obPurchaseTyp = this.route.queryParamMap.pipe(map(params => params.get('type')));
      this.obPurchaseTyp.subscribe((obPurchaseTyp) => {
        this.purchaseTyp= obPurchaseTyp.toString();
      });
  }


  onAddPurchaseDetail(){
    this.model.pods.push(this.modelPod);
    this.source.load(this.model.pods);
  }

  onRemovePurchaseDetail(pod:PurchaseOrderDetail){
    this.model.pods.splice(this.model.pods.indexOf(pod),1);
    this.onCalculateTrxn();
  }

  onCalculateTrxn(){
    this.subTotal=0;
    let subTotalTemp:number=0;
    let taxTotal:number=0;
    this.modelPod.txnAmount=this.modelPod.unitPrice * this.modelPod.quantity;
    if(this.modelPod.unitPrice!=null && this.modelPod.quantity!=null){
      this.modelPod.txnAmount=this.modelPod.unitPrice * this.modelPod.quantity;
    }
    if(this.modelPod.txnAmount!=null){
      subTotalTemp=subTotalTemp+this.modelPod.txnAmount;
      if(this.modelPod.taxAmount!=null){
        taxTotal= taxTotal + (this.modelPod.taxAmount/100 * this.modelPod.txnAmount);
      }
    }
    this.model.totalTaxAmount=taxTotal;
    this.subTotal=subTotalTemp;
    this.model.totalAmount=(this.model.totalTaxAmount + this.subTotal);
  }

  onApprove(){
   this.onCreate(2);
  }

  onSave(){
    this.onCreate(1);
  }
  onCreate(stageId:number){
    this.model.trxnDate = new Date();
    this.model.trxnDate.setDate(this.trxnDtNgb.day);
    this.model.trxnDate.setMonth(this.trxnDtNgb.month);
    this.model.trxnDate.setFullYear(this.trxnDtNgb.year);

    this.model.estDeliveryDate = new Date();
    this.model.estDeliveryDate.setDate(this.dueDtNgb.day);
    this.model.estDeliveryDate.setMonth(this.dueDtNgb.month);
    this.model.estDeliveryDate.setFullYear(this.dueDtNgb.year);

    this.model.stage = new Stage();
    this.model.stage.id=stageId;
     console.log(this.model.pods);
   this.obHttp=this.service.create(this.model);
    this.obHttp.subscribe((observable) =>{
      //this.model= observable;
    });
  }

  selectionChanged(event:any,type:string){
    console.log(event.value);
    if(type=='cust' && event.value[0]!=null){
      this.model.suppId=event.value[0].id;
    }
    else if(type=='inv' && event.value[0]!=null){
      this.modelPod.inventoryId=event.value[0].id;
    }
  }

  openModalAdd(){
    this.openModal(this.modal);
  }

  openModal(modal){
    //this.model = new CustomerSupplier();
   // this.model.address = new Address();
    this.modalService.open(modal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SalesOrder } from '../../../../class/sales_order';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrderDetail } from '../../../../class/sales_order_detail';
import { SalesService } from '../../../../service/sales.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponseWS } from '../../../../class/htt_response_ws';
import { Stage } from '../../../../class/stage';
import { CustomerSupplier } from '../../../../class/supplier_customer';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';
import { Address } from '../../../../class/address';
import { SelectItem } from '../../../../class/selectitem';

@Component({
  selector: 'sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.scss']
})
export class SalesFormComponent implements OnInit {
  @ViewChild('modal') modal: ElementRef;
  model: SalesOrder = new SalesOrder();
  modelSod: SalesOrderDetail = new SalesOrderDetail();
  trxnDtNgb: NgbDateStruct;
  dueDtNgb: NgbDateStruct;
  subTotal: number;
  obHttp: Observable<HttpResponseWS>;
  obSo: Observable<SalesOrder>;
  obSalesTyp: Observable<string>;
  source: LocalDataSource = new LocalDataSource();
  closeResult: string;
  mode: string;
  soFormTitle: string;
  cols: any[];
  constructor(private service: SalesService, private route: ActivatedRoute, private modalService: NgbModal) {
  }

  config = {
    displayKey: "name", //if objects array passed which key to be displayed defaults to description,
    search: true, //enables the search plugin to search in the list
    multiple: false
  };

  settings = {
    //mode : 'external',
    actions: {
      add: true,
      //    edit: false,
      //    delete: false,
      // custom: [{ name: 'onEdit', title: '<i class="nb-edit"></i>' },{ name: 'onDelete', title: '<i class="nb-trash"></i>' }],
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
      coaId: {
        title: 'Account',
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

    this.modelSod = new SalesOrderDetail();
    this.model.sods = [
      {
        id:null,
        name:null,
        description:null,   
        quantity:null,
        unitPrice:null,
        taxAmount:null,
        txnAmount:null,
        discount:null,
        inventoryId:null,
        coaId:null,
      },{
        id:null,
        name:null,
        description:null,   
        quantity:null,
        unitPrice:null,
        taxAmount:null,
        txnAmount:null,
        discount:null,
        inventoryId:null,
        coaId:null,
      },
      {
        id:null,
        name:null,
        description:null,   
        quantity:null,
        unitPrice:null,
        taxAmount:null,
        txnAmount:null,
        discount:null,
        inventoryId:null,
        coaId:null,
      },
      {
        id:null,
        name:null,
        description:null,   
        quantity:null,
        unitPrice:null,
        taxAmount:null,
        txnAmount:null,
        discount:null,
        inventoryId:null,
        coaId:null,
      },
    ];
    this.source.load(this.model.sods);

    this.obSo = this.service.init();
    this.obSo.subscribe((observable) => {
      this.model.custSupps = observable.custSupps;
      this.model.inventories = observable.inventories;
      this.model.coas = observable.coas;
    });

    this.cols = [
      { field: 'name', header: 'Name', type:'txt' },
      { field: 'quantity', header: 'Quantity', type:'txt' },
      { field: 'unitPrice', header: 'Price', type:'txt' },
      { field: 'coaId', header: 'Account', type:'txt' },
      { field: 'taxAmount', header: 'Tax', type:'txt'},
      { field: 'txnAmount', header: 'Ammount', type:'txt' },
      { field: '', header: 'Action', type:'btn' },
    ];

    this.model.custId = 16;
    this.obSalesTyp = this.route.queryParamMap.pipe(map(params => params.get('type')));
    this.obSalesTyp.subscribe((obSalesTyp) => {
      this.model.soType = obSalesTyp;
      if ("I" == this.model.soType) {
        this.soFormTitle = "Invoice";
      } else if ("Q" == this.model.soType) {
        this.soFormTitle = "Quotation";
      }
    });
  }
  onAddSod() {
    this.mode = "add";
    this.modelSod = new SalesOrderDetail();
    this.openModal();
  }
  onEdit(modelSod) {
    this.mode = "edit";
    this.modelSod = modelSod;
    this.openModal();
  }
  onSubmitSod() {
    if (this.mode == "add") {
      this.modelSod.id = this.model.sods.length + 1;
      this.model.sods.push(this.modelSod);
      this.source.load(this.model.sods);
    } else if (this.mode == "edit") {
      let sod: SalesOrderDetail = this.model.sods.find(sod => sod.id == this.modelSod.id, 1);
      sod = this.modelSod;
      this.source.load(this.model.sods);
    }
  }
  onRemoveSalesDetail(sod: SalesOrderDetail) {
    this.model.sods.splice(this.model.sods.indexOf(sod), 1);
    this.onCalculateTrxn();
  }
  onCalculateTrxn() {
    this.subTotal = 0;
    let subTotalTemp: number = 0;
    let taxTotal: number = 0;
    this.modelSod.txnAmount = this.modelSod.unitPrice * this.modelSod.quantity;
    if (this.modelSod.unitPrice != null && this.modelSod.quantity != null) {
      this.modelSod.txnAmount = this.modelSod.unitPrice * this.modelSod.quantity;
    }
    if (this.modelSod.txnAmount != null) {
      subTotalTemp = subTotalTemp + this.modelSod.txnAmount;
      if (this.modelSod.taxAmount != null) {
        taxTotal = taxTotal + (this.modelSod.taxAmount / 100 * this.modelSod.txnAmount);
      }
    }
    this.model.totalTaxAmount = taxTotal;
    this.subTotal = subTotalTemp;
    this.model.totalAmount = (this.model.totalTaxAmount + this.subTotal);
  }

  onAwaitApprove() {
    this.onCreate(2);
  }

  onApprove() {
    this.onCreate(3);
  }

  onApproveNew() {
    this.onCreate(3);
    this.modelSod = new SalesOrderDetail();
    this.model.sods = [];
  }

  onSave() {
    this.onCreate(1);
  }
  onCreate(stageId: number) {
    this.model.trxnDate = new Date();
    this.model.trxnDate.setDate(this.trxnDtNgb.day);
    this.model.trxnDate.setMonth(this.trxnDtNgb.month);
    this.model.trxnDate.setFullYear(this.trxnDtNgb.year);

    this.model.estDeliveryDate = new Date();
    this.model.estDeliveryDate.setDate(this.dueDtNgb.day);
    this.model.estDeliveryDate.setMonth(this.dueDtNgb.month);
    this.model.estDeliveryDate.setFullYear(this.dueDtNgb.year);

    this.model.stage = new Stage();
    this.model.stage.id = stageId;
    console.log(this.model.sods);
    this.obHttp = this.service.create(this.model);
    this.obHttp.subscribe((observable) => {
      //this.model= observable;
    });
  }

  selectionChanged(event: any, type: string) {
    if (type == 'cust' && event.value[0] != null) {
      this.model.custId = event.value[0].id;
    }
    else if (type == 'inv' && event.value[0] != null) {
      this.modelSod.inventoryId = event.value[0].id;
      this.modelSod.name = event.value[0].name;
    }
  }

  onCustom(event: any) {
    this.modelSod = event.data;
    if (event.action == "onEdit") {
      this.onEdit(this.modelSod);
    }
    else if (event.action == "onDelete") {
      //this.onDelete(this.model);
    }
  }

  openModal() {
    this.modalService.open(this.modal).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }
}

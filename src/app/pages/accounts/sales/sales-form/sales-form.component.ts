import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SalesOrder } from '../../../../class/sales_order';
import { SalesOrderDetail } from '../../../../class/sales_order_detail';
import { SalesService } from '../../../../service/sales.service';
import { Observable } from 'rxjs/Observable';
import { Stage } from '../../../../class/stage';
import { ActivatedRoute } from '@angular/router';
import { SelectItem } from '../../../../class/selectitem';
import { environment } from '../../../../../environments/environment';
import { MenuItem, MessageService, Message } from '../../../../components/common/api';
import { HttpResponseWS } from '../../../../class/http_response_ws';
import { AWAIT_PAYMENT_STAGE } from '../../../../common/ecount_const';
import { Inventory } from '../../../../class/inventory';

@Component({
  selector: 'sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.scss']
})
export class SalesFormComponent implements OnInit {
  @Input() soType: string;
  model: SalesOrder = new SalesOrder();
  mode: string;
  soFormTitle: string;
  cols: any[];
  environment = environment;
  items: MenuItem[];
  msgs: Message[] = [];
  custSupps:SelectItem[];
  inventories:SelectItem[];
  coas:SelectItem[];
  taxes:SelectItem[];
  inventories2:Inventory[];
  loadDataFlag:boolean;
  @Output() loadData: EventEmitter<null> =   new EventEmitter();

  constructor(private service: SalesService, private route: ActivatedRoute, private messageService: MessageService) {
  }


  ngOnInit() {
      this.initObject();
      this.initData();
  }

  initObject() {
    //this.model = new SalesOrder();
    this.model.stage = new Stage();
    this.model.stage.id = 0;
    this.model.sods = [];
    this.items = [
      { label: 'Draft', icon: 'pi pi-file', command: () => { this.onSaveDraft(); } },
      { label: 'Submit for Approval', icon: 'pi pi-refresh', command: () => { this.onAwaitApprove(); } },
      { label: 'Approve', icon: 'pi pi-check', command: () => { this.onApprove(); } },
    ];

    this.cols = [
      { field: 'invDD.label', header: 'Name', type: 'txt' },
      { field: 'quantity', header: 'Quantity', type: 'txt' },
      { field: 'unitPrice', header: 'Price', type: 'txt' },
      { field: 'taxDD.label', header: 'Tax', type: 'txt' },
      { field: 'txnAmount', header: 'Ammount', type: 'txt' },
      { field: '', header: 'Action', type: 'btn' },
    ];
    this.model.custId = 16;
    if(this.soType=="I"){
      this.soFormTitle="Invoice";
      this.model.soType = this.soType;
    }else if(this.soType=="Q"){
      this.soFormTitle="Quotation";
      this.model.soType = this.soType;
    }
  }


  initData() {
    let obSo: Observable<SalesOrder> = this.service.init();
    obSo.subscribe((observable) => {
      this.custSupps = observable.custSupps;
      this.inventories = observable.inventories;
      this.coas = observable.coas;
      this.taxes = observable.taxes;
      this.inventories2 = observable.inventories2;
      this.model.soCode = observable.soCode;
    });


  }

  onAddSod() {
    let sod: SalesOrderDetail = new SalesOrderDetail();
    sod.coaDD = new SelectItem();
    sod.invDD = new SelectItem();
    sod.taxDD = new SelectItem();
    this.model.sods.push(sod);
  }

  onChangeDD(option: SelectItem, sod: SalesOrderDetail, type: string) {
    if (type == "inventory") {
      sod.quantity = 1;
      sod.invDD = option;
      sod.unitPrice = sod.invDD.value2;
    
      this.taxes.filter(
        function (tax) {
          if (tax.value == sod.invDD.value4) {
            sod.taxDD = tax;
          }
        }
      );

      this.coas.filter(
        function (coa) {
          if (coa.value == sod.invDD.value3) {
            sod.coaDD = coa;
          }
        }
      );
    } else if (type == "coa") {
      sod.coaDD = option;
    } else if (type == "tax") {
      sod.taxDD = option;
    }
    else if (type == "contact") {
     this.model.custAddress = option.value2;
    }    
    this.onCalculate();
  }

  onRemoveSod(sod: SalesOrderDetail) {
    this.model.sods.splice(this.model.sods.indexOf(sod), 1);
    this.onCalculate();
  }

  onCancel(){
    this.loadData.emit();
  }

  onCalculate() {
    this.model.totalTaxAmount = 0;
    this.model.totalAmount = 0;
    let totalAmount: number = 0;
    let totalTaxAmount: number = 0;
    this.model.sods.filter(function (sod) {
      sod.txnAmount = sod.quantity * sod.unitPrice;
      if (sod.taxDD != null && sod.taxDD.value2 != null) {
        sod.taxDD.value2 = parseInt(sod.taxDD.value2);
        if (sod.taxDD.value2 > 0) {
          sod.taxAmount = (sod.txnAmount * sod.taxDD.value2 / 100);
        } else {
          sod.taxAmount = 0;
        }
      }
      totalTaxAmount = totalTaxAmount + sod.taxAmount;
      totalAmount = totalAmount + sod.txnAmount + totalTaxAmount;
    });
    this.model.totalAmount = totalAmount;
    this.model.totalTaxAmount = totalTaxAmount;
  }

  onSave() {
    let stageId: number = (this.model.stage.id != 0) ? this.model.stage.id : 0;
    this.onCreate(stageId, 'Save');
  }
  onSaveDraft() {
    this.onCreate(1, 'Drafting');
  }
  onAwaitApprove() {
    this.onCreate(2, 'Submit');
  }

  onApprove() {
    this.onCreate(3, 'Approve');
  }

  onReset() {
    this.ngOnInit();
  }
/*
  onApprove() {
    this.msgs = [];
    this.model.salesIds = [];
    this.model.salesIds.push(this.model.id);
    let obHttp: Observable<HttpResponseWS> = this.service.updateSalesOrderStage(this.model.salesIds, AWAIT_PAYMENT_STAGE);
    this.onProcessResponse(obHttp, "Approve");
  }
*/
  onCreate(stageId: number, type: string) {
    let obHttp: Observable<HttpResponseWS> = this.service.create(this.model, stageId);
    this.onProcessResponse(obHttp, type);
  }

  onProcessResponse(obHttp: Observable<HttpResponseWS>, type: string) {
    this.msgs = [];
    let httpResponseWS: HttpResponseWS;
    obHttp.subscribe((observable) => {
      httpResponseWS = observable;
      if (type == "Save" || type == "Drafting" || type == "Submit") {
        this.model.id = httpResponseWS.value;
      } else if (type == "Approve") {
        this.model.stage.id = AWAIT_PAYMENT_STAGE;
      }
      this.msgs.push({ severity: 'success', summary: 'Successfully', detail: httpResponseWS.message });
    },
      error => {
        this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: httpResponseWS.message }];
      });
  }
  onRowSelect(model:SalesOrder){
    this.model = model;
  }

}



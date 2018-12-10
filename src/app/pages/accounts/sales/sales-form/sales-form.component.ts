import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SalesOrder } from '../../../../class/sales_order';
import { SalesOrderDetail } from '../../../../class/sales_order_detail';
import { SalesService } from '../../../../service/sales.service';
import { Observable } from 'rxjs/Observable';
import { Stage } from '../../../../class/stage';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SelectItem } from '../../../../class/selectitem';
import { environment } from '../../../../../environments/environment';
import { MenuItem, MessageService, Message } from '../../../../components/common/api';
import { HttpResponseWS } from '../../../../class/http_response_ws';
import { AWAIT_PAYMENT_STAGE } from '../../../../common/ecount_const';

@Component({ 
  selector: 'sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.scss']
})
export class SalesFormComponent implements OnInit {
  @ViewChild('modal') modal: ElementRef;
  model: SalesOrder = new SalesOrder();
  obHttp: Observable<HttpResponseWS>;
  obSo: Observable<SalesOrder>;
  obSalesTyp: Observable<string>;
  httpResponseWS:HttpResponseWS;

  closeResult: string;
  mode: string;
  soFormTitle: string;
  cols: any[];
  environment = environment;
  items: MenuItem[];
  msgs: Message[] = [];
  invId:number;

  constructor(private service: SalesService, private route: ActivatedRoute, private messageService: MessageService) {
  }


  ngOnInit() {
    this.model = new SalesOrder();
    this.model.stage= new Stage();
    this.model.stage.id=0;
    this.model.sods = [];
    this.items = [
      { label: 'Draft', icon: 'pi pi-file', command: () => { this.onSaveDraft();}},
      {label: 'Submit for Approval', icon: 'pi pi-refresh', command: () => {this.onAwaitApprove();}},
      {label: 'Approve', icon: 'pi pi-check', command: () => {this.onApprove();}},
    ];

    this.obSo = this.service.init();
    this.obSo.subscribe((observable) => {
      this.model.custSupps = observable.custSupps;
      this.model.inventories = observable.inventories;
      this.model.coas = observable.coas;
      this.model.taxes = observable.taxes;
      this.model.inventories2 = observable.inventories2;
      this.model.soCode = observable.soCode;
    });

    this.cols = [
      { field: 'invDD.label', header: 'Name', type: 'txt' },
      { field: 'quantity', header: 'Quantity', type: 'txt' },
      { field: 'unitPrice', header: 'Price', type: 'txt' },
      { field: 'coaDD.label', header: 'Account', type: 'txt' },
      { field: 'taxDD.label', header: 'Tax', type: 'txt' },
      { field: 'txnAmount', header: 'Ammount', type: 'txt' },
      { field: '', header: 'Action', type: 'btn' },
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
    let sod: SalesOrderDetail = new SalesOrderDetail();
    sod.coaDD = new SelectItem();
    sod.invDD = new SelectItem();
    sod.taxDD = new SelectItem();
    this.model.sods.push(sod);
  }

  onChangeDD(option: SelectItem, sod: SalesOrderDetail, type: string) {
    if (type == "inventory") {
      sod.quantity=1;
      sod.invDD = option;
      sod.unitPrice=sod.invDD.value2;
      this.model.taxes.filter(
        function(tax){
          if(tax.value==sod.invDD.value4){
            sod.taxDD = tax;
          }
        }
      );

      this.model.coas.filter(
        function(coa){
          if(coa.value==sod.invDD.value3){
            sod.coaDD = coa;
          }
        }
      );
    } else if (type == "coa") {
      sod.coaDD = option;
    } else if (type == "tax") {
      sod.taxDD = option;
    }
    this.onCalculate();
  }

  onRemoveSod(sod: SalesOrderDetail) {
    this.model.sods.splice(this.model.sods.indexOf(sod), 1);
    this.onCalculate();
  }

  onCalculate() {
    this.model.totalTaxAmount = 0;
    this.model.totalAmount=0;
    let totalAmount:number=0;
    let totalTaxAmount:number=0;
    this.model.sods.filter(function (sod) {
      sod.txnAmount = sod.quantity * sod.unitPrice;
      if (sod.taxDD != null && sod.taxDD.value2!=null ) {
          sod.taxDD.value2 = parseInt(sod.taxDD.value2);
        if (sod.taxDD.value2 > 0) {
          sod.taxAmount = (sod.txnAmount * sod.taxDD.value2 / 100);
        }else{
          sod.taxAmount =0;
        }
      }
      totalTaxAmount = totalTaxAmount + sod.taxAmount;
      totalAmount = totalAmount+ sod.txnAmount+totalTaxAmount;
    });
    this.model.totalAmount = totalAmount;
    this.model.totalTaxAmount = totalTaxAmount;
  }

  onSave(){
    let stageId:number=(this.model.stage.id!=0)?this.model.stage.id:0;
    this.onCreate(stageId,'Save');
  }
  onSaveDraft() {
    this.onCreate(1,'Drafting');
  }
  onAwaitApprove() {
    this.onCreate(2,'Submit');
  }
  
  onReset() {
     this.ngOnInit();
  }

  onApprove() {
    this.msgs = [];
    this.model.salesIds = [];
    this.model.salesIds.push(this.model.id);
    this.obHttp = this.service.updateSalesOrderStage(this.model.salesIds,AWAIT_PAYMENT_STAGE);
    this.obHttp.subscribe((observable) => { 
      this.httpResponseWS=observable;
        this.model.stage.id=AWAIT_PAYMENT_STAGE;
        this.msgs.push({ severity: 'success', summary: 'Successfully', detail: 'Approve' });
    },
    error => {
      this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: 'System Error' }];
    });


  }

  onCreate(stageId: number,type:string) {
    this.msgs = [];
    this.obHttp = this.service.create(this.model,stageId);
    this.obHttp.subscribe((observable) => { 
      this.httpResponseWS=observable;
      this.model.id=this.httpResponseWS.value;
        this.msgs.push({ severity: 'success', summary: 'Successfully', detail: type });
    },
    error => {
      this.msgs = [{ severity: 'error', summary: 'Confirmed', detail: 'System Error' }];
    });
  }
}

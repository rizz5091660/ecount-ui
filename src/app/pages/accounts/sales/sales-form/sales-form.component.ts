import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SalesOrder } from '../../../../class/sales_order';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrderDetail } from '../../../../class/sales_order_detail';
import { SalesService } from '../../../../service/sales.service';
import { Observable } from 'rxjs/Observable';
//import { HttpResponseWS } from '../../../../class/htt_response_ws';
import { Stage } from '../../../../class/stage';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SelectItem } from '../../../../class/selectitem';
import { environment } from '../../../../../environments/environment';
import { MenuItem, MessageService, Message } from '../../../../components/common/api';
import { HttpResponseWS } from '../../../../class/http_response_ws';
import { HttpResponse } from '@angular/common/http';

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
    this.model.sods = [];
    this.items = [
      {
        label: 'Submit for Approval', icon: 'pi pi-refresh', command: () => {
          // this.update();
        }
      },
      {
        label: 'Approve', icon: 'pi pi-check', command: () => {
          //  this.delete();
        }
      },
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

  onAwaitApprove() {
    this.onCreate(2);
  }

  onApprove() {
    this.onCreate(3);
  }

  onReset() {
     this.model = new SalesOrder();
     this.model.sods = [];
  }

  onSave() {
    this.onCreate(1);
  }

  onCreate(stageId: number) {
    this.msgs = [];
    this.model.stage = new Stage();
    this.model.stage.id = stageId;
    this.obHttp = this.service.create(this.model);
    this.obHttp.subscribe((observable) => { 
      this.httpResponseWS=observable;
      console.log(observable);
      console.log(this.httpResponseWS);
      if(this.httpResponseWS.status==200){
        this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Order submitted' });
      }
    });
  }
}

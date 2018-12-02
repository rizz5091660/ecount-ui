import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SalesOrder } from '../../../../class/sales_order';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrderDetail } from '../../../../class/sales_order_detail';
import { SalesService } from '../../../../service/sales.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponseWS } from '../../../../class/htt_response_ws';
import { Stage } from '../../../../class/stage';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { LocalDataSource } from 'ng2-smart-table';
import { SelectItem } from '../../../../class/selectitem';
import { environment } from '../../../../../environments/environment';
import { MenuItem, MessageService, Message } from '../../../../components/common/api';

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
  source: LocalDataSource = new LocalDataSource();
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
    });

    this.cols = [
      { field: 'name', header: 'Name', type: 'txt' },
      { field: 'quantity', header: 'Quantity', type: 'txt' },
      { field: 'unitPrice', header: 'Price', type: 'txt' },
      { field: 'coaId', header: 'Account', type: 'txt' },
      { field: 'taxAmount', header: 'Tax', type: 'txt' },
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
  /*
  onAddSod() {
    this.mode = "add";
    this.modelSod = new SalesOrderDetail();
    this.openModal();
  }*/
  onAddSod() {
    let sod: SalesOrderDetail = new SalesOrderDetail();
    sod.coaDD = new SelectItem();
    sod.invDD = new SelectItem();
    sod.taxDD = new SelectItem();
    this.model.sods.push(sod);
  }

  onChangeDD(option: SelectItem, sod: SalesOrderDetail, type: string) {
    if (type == "inventory") {
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
      this.onCalculate();
    }
    console.log(sod.coaDD.value+" "+sod.taxDD.value);
  }

  onSubmitSod() {
    if (this.mode == "add") {
     // this.modelSod.id = this.model.sods.length + 1;
     // this.model.sods.push(this.modelSod);
      this.source.load(this.model.sods);
    } else if (this.mode == "edit") {
      //let sod: SalesOrderDetail = this.model.sods.find(sod => sod.id == this.modelSod.id, 1);
      //sod = this.modelSod;
      this.source.load(this.model.sods);
    }
  }
  onRemoveSod(sod: SalesOrderDetail) {
    this.model.sods.splice(this.model.sods.indexOf(sod), 1);
    this.onCalculate();
  }

  onCalculate() {
    this.model.totalTaxAmount = 0;
    this.model.totalAmount=0;
    let taxSod = 0;
    let totalAmount:number=0;
    let totalTaxAmount:number=0;
    this.model.sods.filter(function (sod) {
      sod.txnAmount = sod.quantity * sod.unitPrice;
      if (sod.taxDD != null) {
        sod.taxDD.value2 = parseInt(sod.taxDD.value2);
        if (sod.taxDD.value2 > 0) {
          taxSod = (sod.txnAmount * sod.taxDD.value2 / 100);
          //sod.txnAmount = sod.txnAmount - taxSod;
        }
      }
      totalTaxAmount = totalTaxAmount + taxSod;
      totalAmount = totalAmount+ sod.txnAmount+totalTaxAmount;
    });
    this.model.totalAmount = totalAmount;
    this.model.totalTaxAmount = totalTaxAmount;

  }

  save(severity: string) {
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Order submitted' });
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
    this.model.stage = new Stage();
    this.model.stage.id = stageId;
    console.log(this.model.sods);
    this.obHttp = this.service.create(this.model);
    this.obHttp.subscribe((observable) => {
      //this.model= observable;
    });
  }

}

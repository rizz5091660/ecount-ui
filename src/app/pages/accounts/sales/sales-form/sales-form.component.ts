import { Component, OnInit } from '@angular/core';
import { SalesOrder } from '../../../../class/sales_order';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrderDetail } from '../../../../class/sales_order_detail';
import { SalesService } from '../../../../service/sales.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponseWS } from '../../../../class/htt_response_ws';
import { Stage } from '../../../../class/stage';
import { CustomerSupplier } from '../../../../class/supplier_customer';
import { DropDownModel } from '../../../../class/drop_down';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.scss']
})
export class SalesFormComponent implements OnInit {
  model:SalesOrder = new SalesOrder();
  trxnDtNgb: NgbDateStruct;
  dueDtNgb: NgbDateStruct;
  subTotal:number;  
  obHttp:Observable<HttpResponseWS>;
  obSo:Observable<SalesOrder>;
  custDD:DropDownModel=new DropDownModel();
  obSalesTyp:Observable<string>;
  salesTyp:string;
  constructor(private service:SalesService,private route: ActivatedRoute) { }

  config = {
    displayKey:"name", //if objects array passed which key to be displayed defaults to description,
    search:true, //enables the search plugin to search in the list
    multiple:false
    };

  ngOnInit() {
    this.model.sods=[
      {
        id:null,
        name:null,
        description:null,
        quantity:null,
        unitPrice:null,
        taxAmount:null,
        txnAmount:null,
        discount:null,
        inventoryId:null
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
        inventoryId:null
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
        inventoryId:null
      }];

      this.obSo=this.service.init();
      this.obSo.subscribe((observable) =>{
        this.model.custSupps=observable.custSupps;
        this.model.inventories=observable.inventories;
      });

      this.obSalesTyp = this.route.queryParamMap.pipe(map(params => params.get('type')));
      this.obSalesTyp.subscribe((obSalesTyp) => {
        this.salesTyp= obSalesTyp.toString();
      });
  }


  onAddSalesDetail(){
    let sod = new SalesOrderDetail();
    this.model.sods.push(sod);
  }

  onRemoveSalesDetail(sod:SalesOrderDetail){
    this.model.sods.splice(this.model.sods.indexOf(sod),1);
    this.onCalculateTrxn();
  }

  onCalculateTrxn(){
    this.subTotal=0;
    let subTotalTemp:number=0;
    let taxTotal:number=0;
    this.model.sods.forEach(function(sod){
      if(sod.unitPrice!=null && sod.quantity!=null){
        sod.txnAmount=sod.unitPrice * sod.quantity;
      }
      if(sod.txnAmount!=null){
        subTotalTemp=subTotalTemp+sod.txnAmount;
        if(sod.taxAmount!=null){
          taxTotal= taxTotal + (sod.taxAmount/100 * sod.txnAmount);
        }
      }
    });
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
     console.log(this.model.sods);
   this.obHttp=this.service.create(this.model);
    this.obHttp.subscribe((observable) =>{
      //this.model= observable;
    });
  }

  selectionChanged(event:any,type:string,index:number){
    console.log(event.value);
    if(type=='cust' && event.value[0]!=null){
      this.model.custId=event.value[0].id;
    }
    else if(type=='inv' && event.value[0]!=null){
      this.model.sods[index].inventoryId=event.value[0].id;
    }
  }
}

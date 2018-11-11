import { Component, OnInit } from '@angular/core';
import { SalesOrder } from '../../../../class/sales_order';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrderDetail } from '../../../../class/sales_order_detail';
import { SalesService } from '../../../../service/sales.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponseWS } from '../../../../class/htt_response_ws';

@Component({
  selector: 'sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.scss']
})
export class SalesFormComponent implements OnInit {
  model:SalesOrder;
  trxnDtNgb: NgbDateStruct;
  dueDtNgb: NgbDateStruct;
  subTotal:number;  
  obHttp:Observable<HttpResponseWS>;
  constructor(private service:SalesService) { }

  ngOnInit() {
    this.model = new SalesOrder();
    this.model.salesOrderDetails=[
      {
        id:null,
        name:null,
        description:null,
        quantity:null,
        unitPrice:null,
        taxAmount:null,
        trxnAmount:null,
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
        trxnAmount:null,
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
        trxnAmount:null,
        discount:null,
        inventoryId:null
      }];
  }


  onAddSalesDetail(){
    let sod = new SalesOrderDetail();
    this.model.salesOrderDetails.push(sod);
  }

  onRemoveSalesDetail(sod:SalesOrderDetail){
    this.model.salesOrderDetails.splice(this.model.salesOrderDetails.indexOf(sod),1);
    this.onCalculateTrxn();
  }

  onCalculateTrxn(){
    this.subTotal=0;
    let subTotalTemp:number=0;
    let taxTotal:number=0;
    this.model.salesOrderDetails.forEach(function(sod){
      if(sod.unitPrice!=null && sod.quantity!=null){
        sod.trxnAmount=sod.unitPrice * sod.quantity;
      }
      if(sod.trxnAmount!=null){
        subTotalTemp=subTotalTemp+sod.trxnAmount;
        if(sod.taxAmount!=null){
          taxTotal= taxTotal + (sod.taxAmount/100 * sod.trxnAmount);
        }
      }
    });
    this.model.totalTaxAmount=taxTotal;
    this.subTotal=subTotalTemp;
    this.model.totalAmount=(this.model.totalTaxAmount + this.subTotal);
  }

  onCreate(){
    this.model.trxnDate = new Date();
    this.model.trxnDate.setDate(this.trxnDtNgb.day);
    this.model.trxnDate.setMonth(this.trxnDtNgb.month);
    this.model.trxnDate.setFullYear(this.trxnDtNgb.year);

    this.model.estDeliveryDate = new Date();
    this.model.estDeliveryDate.setDate(this.dueDtNgb.day);
    this.model.estDeliveryDate.setMonth(this.dueDtNgb.month);
    this.model.estDeliveryDate.setFullYear(this.dueDtNgb.year);

    // let sods=this.model.salesOrderDetails.map(
    //   function(sod){
    //     if(sod!=null && sod.name!=null){
    //       return sod;
    //     }
    //   }
    // );

    //this.model.salesOrderDetails  = sods;
     this.model.salesOrderDetails.forEach(function(sod){
        console.log(sod.name);
          // if(sod.name==null){
          //   this.model.salesOrderDetails.splice(this.model.salesOrderDetails.indexOf(sod),1);
          // }
       }
     );

    this.obHttp=this.service.create(this.model);
    this.obHttp.subscribe((observable) =>{
      //this.model= observable;
    });
  }
}

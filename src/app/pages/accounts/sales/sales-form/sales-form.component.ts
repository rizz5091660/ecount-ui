import { Component, OnInit } from '@angular/core';
import { SalesOrder } from '../../../../class/sales_order';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrderDetail } from '../../../../class/sales_order_detail';

@Component({
  selector: 'sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.scss']
})
export class SalesFormComponent implements OnInit {
  model:SalesOrder;
  trxnDtNgb: NgbDateStruct;
  dueDtNgb: NgbDateStruct;
  subTotal:number=0;  
  constructor() { }

  ngOnInit() {
    this.model = new SalesOrder();
    this.model.salesOrderDetails=[
      {
        id:1,
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
        id:2,
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
        id:3,
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

  onCalculateTrxn(){
    this.subTotal=0;
    let subTotalTemp:number=0;
    let taxTotal:number=0;
    this.model.salesOrderDetails.forEach(function(sod){
      if(sod.taxAmount!=null){
        taxTotal= taxTotal + (sod.taxAmount/100 * sod.trxnAmount);
        subTotalTemp=subTotalTemp+sod.trxnAmount;

      }
    });
    this.model.totalTaxAmount=taxTotal;
    this.subTotal=subTotalTemp*1  ;
    this.model.totalAmount=(this.model.totalTaxAmount + this.subTotal)*1;
  }
}

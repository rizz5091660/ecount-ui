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

  onCalculateTotalTrxn(){
    this.model.totalAmount=0;
    this.model.totalAmount= this.model.salesOrderDetails.filter((sod) =>sod.trxnAmount)
    .map((sod) => +sod.trxnAmount)
    .reduce((sum, current) => sum + current);
  }

}

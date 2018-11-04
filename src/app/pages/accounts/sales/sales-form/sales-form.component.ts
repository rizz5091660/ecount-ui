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
  soDetails:SalesOrderDetail[]=[
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
  constructor() { }

  ngOnInit() {
    this.model = new SalesOrder();
  }

  onAddSalesDetail(){
    let sod = new SalesOrderDetail();
    this.soDetails.push(sod);
  }

}

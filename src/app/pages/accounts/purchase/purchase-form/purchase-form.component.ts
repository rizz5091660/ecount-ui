import { Component, OnInit } from '@angular/core';
import { PurchaseOrder } from '../../../../class/purchase_order';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseOrderDetail } from '../../../../class/purchase_order_detail';
import { PurchaseService } from '../../../../service/purchase.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponseWS } from '../../../../class/http_response_ws';
import { Stage } from '../../../../class/stage';
import { DropDownModel } from '../../../../class/drop_down';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Message } from '../../../../components/common/message';
import { MenuItem } from '../../../../components/common/menuitem';
import { environment } from '../../../../../environments/environment';
import { SelectItem } from '../../../../class/selectitem';

@Component({
  selector: 'purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent implements OnInit {
  model: PurchaseOrder = new PurchaseOrder();
  modelPod: PurchaseOrderDetail = new PurchaseOrderDetail();
  subTotal: number;
  obHttp: Observable<HttpResponseWS>;
  custDD: DropDownModel = new DropDownModel();
  msgs: Message[] = [];
  items: MenuItem[];
  environment = environment;
  soFormTitle: string;
  cols:any[];
  constructor(private service: PurchaseService, private route: ActivatedRoute, private modalService: NgbModal) { }


  ngOnInit() {
    this.model = new PurchaseOrder();
    this.model.stage= new Stage();
    this.model.stage.id=0;
    this.modelPod = new PurchaseOrderDetail();
    this.model.pods = [];
    this.items = [
      { label: 'Draft', icon: 'pi pi-file', command: () => { this.onSaveDraft();}},
      {label: 'Submit for Approval', icon: 'pi pi-refresh', command: () => {this.onAwaitApprove();}},
      {label: 'Approve', icon: 'pi pi-check', command: () => {this.onApprove();}},
    ];

    let obPo: Observable<PurchaseOrder> = this.service.init();
    obPo.subscribe((observable) => {
      this.model.custSupps = observable.custSupps;
      this.model.inventories = observable.inventories;
      this.model.coas = observable.coas;
      this.model.taxes = observable.taxes;
      this.model.inventories2 = observable.inventories2;
      this.model.poCode = observable.poCode;
    });

    this.cols = [
      { field: 'invDD.label', header: 'Name', type: 'txt' },
      { field: 'quantity', header: 'Quantity', type: 'txt' },
      { field: 'unitPrice', header: 'Price', type: 'txt' },
      { field: 'coaDD.label', header: 'Account', type: 'txt' },
      { field: 'taxDD.label', header: 'Tax', type: 'txt' },
      { field: 'txnAmount', header: 'Ammount', type: 'txt' },
    ];

    let obPurchaseTyp: Observable<string> = this.route.queryParamMap.pipe(map(params => params.get('type')));
    obPurchaseTyp.subscribe((obPurchaseTyp) => {
      this.model.poType = obPurchaseTyp.toString();
      if ("B" == this.model.poType) {
        this.soFormTitle = "Bill";
      } else if ("P" == this.model.poType) {
        this.soFormTitle = "Purchase Order";
      }
    });
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

  onReset() {
    this.ngOnInit();
  }

  onApprove() {

  }


 onAdd(){
  let pod: PurchaseOrderDetail = new PurchaseOrderDetail();
  pod.coaDD = new SelectItem();
  pod.invDD = new SelectItem();
  pod.taxDD = new SelectItem();
  this.model.pods.push(pod);

 }

  onRemovePurchaseDetail(pod: PurchaseOrderDetail) {
    this.model.pods.splice(this.model.pods.indexOf(pod), 1);
    this.onCalculateTrxn();
  }

  onCalculateTrxn() {
    this.subTotal = 0;
    let subTotalTemp: number = 0;
    let taxTotal: number = 0;
    this.modelPod.txnAmount = this.modelPod.unitPrice * this.modelPod.quantity;
    if (this.modelPod.unitPrice != null && this.modelPod.quantity != null) {
      this.modelPod.txnAmount = this.modelPod.unitPrice * this.modelPod.quantity;
    }
    if (this.modelPod.txnAmount != null) {
      subTotalTemp = subTotalTemp + this.modelPod.txnAmount;
      if (this.modelPod.taxAmount != null) {
        taxTotal = taxTotal + (this.modelPod.taxAmount / 100 * this.modelPod.txnAmount);
      }
    }
    this.model.totalTaxAmount = taxTotal;
    this.subTotal = subTotalTemp;
    this.model.totalAmount = (this.model.totalTaxAmount + this.subTotal);
  }


  onCreate(stageId: number, type: string) {

    this.model.stage = new Stage();
    this.model.stage.id = stageId;
    console.log(this.model.pods);
    this.obHttp = this.service.create(this.model);
    this.obHttp.subscribe((observable) => {
      //this.model= observable;
    });
  }

  selectionChanged(event: any, type: string) {
    console.log(event.value);
    if (type == 'cust' && event.value[0] != null) {
      this.model.suppId = event.value[0].id;
    }
    else if (type == 'inv' && event.value[0] != null) {
      this.modelPod.inventoryId = event.value[0].id;
    }
  }

}

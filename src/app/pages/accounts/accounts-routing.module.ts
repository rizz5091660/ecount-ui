import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { Account } from '../../class/account';
import { AccountsComponent } from './accounts.component';
import { SalesDashboardComponent } from './sales/sales-dashboard/sales-dashboard.component';
import { SalesSearchComponent } from './sales/sales-search/sales-search.component';
import { SalesFormComponent } from './sales/sales-form/sales-form.component';
import { PurchaseDashboardComponent } from './purchase/purchase-dashboard/purchase-dashboard.component';
import { PurchaseSearchComponent } from './purchase/purchase-search/purchase-search.component';
import { PurchaseFormComponent } from './purchase/purchase-form/purchase-form.component';
import { InventorySearchComponent } from './inventory/inventory-search/inventory-search.component';
import { InventoryFormComponent } from './inventory/inventory-form/inventory-form.component';

const routes: Routes = [{
    path: '',
    component: AccountsComponent,
    children: [
        {
            path: 'sales/sales-dashboard',
            component: SalesDashboardComponent
        },
        {
            path: 'sales/sales-search',
            component: SalesSearchComponent
        },
        {
            path: 'sales/sales-form',
            component: SalesFormComponent
        },
        {
            path: 'purchase/purchase-dashboard',
            component: PurchaseDashboardComponent
        },
        {
            path: 'purchase/purchase-search',
            component: PurchaseSearchComponent
        },
        {
            path: 'purchase/purchase-form',
            component: PurchaseFormComponent
        },
        {
            path: 'inventory/inventory-search',
            component: InventorySearchComponent
        },
        {
            path: 'inventory/inventory-form',
            component: InventoryFormComponent
        },

    ]

}]
@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[
        RouterModule
    ]
})

export class AccountsRoutingModule{

}

export const routedComponents=[
    AccountsComponent,SalesDashboardComponent,SalesSearchComponent,PurchaseDashboardComponent,PurchaseSearchComponent,
    InventorySearchComponent,SalesFormComponent, PurchaseFormComponent,InventoryFormComponent
]
import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { Account } from '../../class/account';
import { AccountsComponent } from './accounts.component';
import { SalesDashboardComponent } from './sales/sales-dashboard/sales-dashboard.component';
import { SalesSearchComponent } from './sales/sales-search/sales-search.component';

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
    AccountsComponent,SalesDashboardComponent,SalesSearchComponent
]
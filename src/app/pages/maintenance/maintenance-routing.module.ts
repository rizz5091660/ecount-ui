import {NgModule} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';
import { MaintenanceComponent } from './maintenance.component';
import { SupplierListComponent } from './supplier_list/supplier_list.component';
import { CoaComponent } from './coa/coa.component';

const routes: Routes=[{
    path:'',
    component:MaintenanceComponent,
    children:[
        {
            path:'contact',
            component:SupplierListComponent
        },
        {
            path:'coa',
            component:CoaComponent
        }
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


export class MaintenanceRoutingModule{

}

export const routedComponents=[
    MaintenanceComponent,
    SupplierListComponent,
    CoaComponent
];
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { AccountsRoutingModule,routedComponents } from './accounts-routing.module';
import { SalesService } from '../../service/sales.service';
import { PurchaseService } from '../../service/purchase.service';
import { SalesFormComponent } from './sales/sales-form/sales-form.component';
import { PurchaseFormComponent } from './purchase/purchase-form/purchase-form.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { TableModule } from '../../components/table/table';
import { DropdownModule } from '../../components/dropdown/dropdown';
import { ButtonModule } from '../../components/button/button';
import { CalendarModule } from '../../components/calendar/calendar';
import { InputTextModule } from '../../components/inputtext/inputtext';


@NgModule({
  imports: [ 
    CommonModule,AccountsRoutingModule,ThemeModule,Ng2SmartTableModule,
    TableModule,DropdownModule,ButtonModule,CalendarModule,InputTextModule
  ],
  providers: [SalesService,PurchaseService,SmartTableService],
  declarations: [...routedComponents, SalesFormComponent, PurchaseFormComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class AccountsModule { }

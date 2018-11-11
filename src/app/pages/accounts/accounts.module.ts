import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import {AccountsRoutingModule,routedComponents} from './accounts-routing.module';
import { SalesService } from '../../service/sales.service';
import { SalesFormComponent } from './sales/sales-form/sales-form.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [ 
    CommonModule,AccountsRoutingModule,ThemeModule,Ng2SmartTableModule
  ],
  providers: [SalesService],
  declarations: [...routedComponents, SalesFormComponent]
})
export class AccountsModule { }

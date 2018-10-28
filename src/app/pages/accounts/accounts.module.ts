import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import {AccountsRoutingModule,routedComponents} from './accounts-routing.module';
import { SalesService } from '../../service/sales.service';



@NgModule({
  imports: [ 
    CommonModule,AccountsRoutingModule,ThemeModule
  ],
  providers: [SalesService],
  declarations: [...routedComponents]
})
export class AccountsModule { }

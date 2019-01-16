import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { AccountsRoutingModule,routedComponents } from './accounts-routing.module';
import { SalesService } from '../../service/sales.service';
import { PurchaseService } from '../../service/purchase.service';
import { TableModule } from '../../components/table/table';
import { DropdownModule } from '../../components/dropdown/dropdown';
import { ButtonModule } from '../../components/button/button';
import { CalendarModule } from '../../components/calendar/calendar';
import { InputTextModule } from '../../components/inputtext/inputtext';
import { SplitButtonModule } from '../../components/splitbutton/splitbutton';
import { MessageService, ConfirmationService } from '../../components/common/api';
import { MessageModule } from '../../components/message/message';
import { MessagesModule } from '../../components/messages/messages';
import { PanelModule } from '../../components/panel/panel';
import { StepsModule } from '../../components/steps/steps';
import { ToolbarModule } from '../../components/toolbar/toolbar';
import { InputTextareaModule } from '../../components/inputtextarea/inputtextarea';
import { InventoryService } from '../../service/inventory.service';
import { DialogModule } from '../../components/dialog/dialog';
import { CheckboxModule } from '../../components/checkbox/checkbox';
import { SelectButtonModule } from '../../components/selectbutton/selectbutton';
import { SidebarModule } from '../../components/sidebar/sidebar';
import { ConfirmDialogModule } from '../../components/confirmdialog/confirmdialog';
import { ScrollPanelModule } from '../../components/scrollpanel/scrollpanel';


@NgModule({
  imports: [ 
    CommonModule,AccountsRoutingModule,ThemeModule,
    TableModule,DropdownModule,ButtonModule,CalendarModule,InputTextModule,SplitButtonModule,
    MessagesModule,MessageModule,PanelModule,StepsModule,ToolbarModule,InputTextareaModule,
    DialogModule,CheckboxModule,SelectButtonModule,SidebarModule,ConfirmDialogModule,ScrollPanelModule
  ],
  providers: [SalesService,PurchaseService,InventoryService,MessageService,ConfirmationService],
  declarations: [...routedComponents],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class AccountsModule { }

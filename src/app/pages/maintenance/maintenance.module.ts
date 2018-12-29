import {NgModule} from '@angular/core';
import {MaintenanceRoutingModule,routedComponents} from './maintenance-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { SupplierService } from '../../service/supplier.service';
import { CoaService } from '../../service/coa.service';
import { TaxComponent } from './tax/tax.component';
import { PanelModule } from '../../components/panel/panel';
import { MessagesModule } from '../../components/messages/messages';
import { MessageModule } from '../../components/message/message';
import { TableModule } from '../../components/table/table';
import { ButtonModule } from '../../components/button/button';
import { ConfirmDialogModule } from '../../components/confirmdialog/confirmdialog';
import { ConfirmationService } from '../../components/common/api';
import { DialogModule } from '../../components/dialog/dialog';
import { ScrollPanelModule } from '../../components/scrollpanel/scrollpanel';
import { ListboxModule } from '../../components/listbox/listbox';
import { RadioButtonModule } from '../../components/radiobutton/radiobutton';
import { ToolbarModule } from '../../components/toolbar/toolbar';
import { InputTextModule } from '../../components/inputtext/inputtext';
import { DropdownModule } from '../../components/dropdown/dropdown';
import { InputTextareaModule } from '../../components/inputtextarea/inputtextarea';
import { CalendarModule } from '../../components/calendar/calendar';
import { SidebarModule } from '../../components/sidebar/sidebar';

@NgModule({
    imports:[MaintenanceRoutingModule,ThemeModule,PanelModule,MessagesModule,MessageModule,
        TableModule,ButtonModule,ConfirmDialogModule,DialogModule,ScrollPanelModule,ListboxModule,
        RadioButtonModule,ToolbarModule,InputTextModule,DropdownModule,InputTextareaModule,CalendarModule,
        SidebarModule], 
    declarations:[...routedComponents, TaxComponent],
    providers: [SupplierService,CoaService,ConfirmationService],
})
export class MaintenanceModule{

}
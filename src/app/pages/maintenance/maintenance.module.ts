import {NgModule} from '@angular/core';
import {MaintenanceRoutingModule,routedComponents} from './maintenance-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { SupplierService } from '../../service/supplier.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { ModalComponent } from '../shares/modals/modal/modal.component';
import { SharesModule } from '../shares/shares.module';
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

@NgModule({
    imports:[MaintenanceRoutingModule,ThemeModule,Ng2SmartTableModule,SharesModule,PanelModule,MessagesModule,MessageModule,
        TableModule,ButtonModule,ConfirmDialogModule,DialogModule,ScrollPanelModule,ListboxModule,RadioButtonModule], 
    declarations:[...routedComponents, TaxComponent],
    providers: [SupplierService,CoaService,SmartTableService,ConfirmationService],
    entryComponents: [
        ModalComponent, 
      ],
})
export class MaintenanceModule{

}
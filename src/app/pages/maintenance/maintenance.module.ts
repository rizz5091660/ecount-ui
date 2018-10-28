import {NgModule} from '@angular/core';
import {MaintenanceRoutingModule,routedComponents} from './maintenance-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import {CustomerSupplier} from '../../class/supplier_customer';
import { SupplierService } from '../../service/supplier.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { ModalComponent } from '../shares/modals/modal/modal.component';
import { SharesModule } from '../shares/shares.module';
import { CoaComponent } from './coa/coa.component';
import { CoaService } from '../../service/coa.service';
import { TaxComponent } from './tax/tax.component';

@NgModule({
    imports:[MaintenanceRoutingModule,ThemeModule,Ng2SmartTableModule,SharesModule], 
    declarations:[...routedComponents, TaxComponent],
    providers: [SupplierService,CoaService,SmartTableService],
    entryComponents: [
        ModalComponent,
      ],
})
export class MaintenanceModule{

}
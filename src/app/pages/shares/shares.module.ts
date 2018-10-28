import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { ModalsComponent } from './modals/modals.component';
import { ModalComponent } from './modals/modal/modal.component';
import { SharesComponent } from './shares.component';
import { SharesRoutingModule } from './shares-routing.module';

const components = [
  SharesComponent,
  ModalsComponent,
  ModalComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    SharesRoutingModule,
  ],
  declarations: [
    ...components,
  ],
  entryComponents: [
    ModalComponent,
  ],
})
export class SharesModule { }

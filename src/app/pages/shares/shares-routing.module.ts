import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharesComponent } from './shares.component';
import { ModalsComponent } from './modals/modals.component';


const routes: Routes = [{
    path: '',
    component: SharesComponent,
    children: [{
      path: 'modals',
      component: ModalsComponent,
    },
]}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class SharesRoutingModule { }
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'accounts',
      loadChildren:'./accounts/accounts.module#AccountsModule'
    },
    {
      path:'maintenance',
      loadChildren:'./maintenance/maintenance.module#MaintenanceModule'
    },
    {
      path: '',
      redirectTo: 'maintenance',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}

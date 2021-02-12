import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminMensajePage } from './admin-mensaje.page';

const routes: Routes = [
  {
    path: '',
    component: AdminMensajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminMensajePageRoutingModule {}

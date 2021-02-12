import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncargadoPage } from './encargado.page';

const routes: Routes = [
  {
    path: '',
    component: EncargadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncargadoPageRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SugerenciaPageRoutingModule } from './sugerencia-routing.module';

import { SugerenciaPage } from './sugerencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SugerenciaPageRoutingModule
  ],
  declarations: [SugerenciaPage]
})
export class SugerenciaPageModule {}

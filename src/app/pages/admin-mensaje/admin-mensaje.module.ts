import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminMensajePageRoutingModule } from './admin-mensaje-routing.module';

import { AdminMensajePage } from './admin-mensaje.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminMensajePageRoutingModule,
    ComponentsModule
  ],
  declarations: [AdminMensajePage]
})
export class AdminMensajePageModule {}

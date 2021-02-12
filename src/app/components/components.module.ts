import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrabajosComponent } from './trabajos/trabajos.component';
import { IonicModule } from '@ionic/angular';
import { TrabajoComponent } from './trabajo/trabajo.component';
import { PipesModule } from '../pipes/pipes.module';
import { DetalleComponent } from './detalle/detalle.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
import { DetalleOrdenComponent } from './detalle-orden/detalle-orden.component';


@NgModule({
  declarations: [TrabajosComponent, TrabajoComponent, DetalleComponent, MenuComponent, ChatComponent, DetalleOrdenComponent],
  entryComponents: [
    DetalleComponent,
    ChatComponent,
    DetalleOrdenComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    //  importar para usar componentes de ionic
    IonicModule,
    PipesModule,
    // para usar rutas
    RouterModule
  ],
  exports: [
    //  exportar para usarlos fuera
    TrabajosComponent,
    MenuComponent,
    ChatComponent,
    DetalleOrdenComponent
  ]
})
export class ComponentsModule { }

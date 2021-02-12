import { Component, OnInit } from '@angular/core';
import { TrabajosService } from '../../services/trabajos.service';
import { ActionSheetController } from '@ionic/angular';
import { UiserviceService } from '../../services/uiservice.service';
import { Queja } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  quejas: Queja[] = [];
  constructor(private trabajosService: TrabajosService,
              public actionSheetController: ActionSheetController,
              private uiService: UiserviceService) { }

  ngOnInit() {
    this.cargarQuejas();
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Marcar quejas como leídas',
        icon: 'book',
        handler: () => {
          const leidas = this.trabajosService.leerQuejas();
          if (leidas) {
            this.uiService.presentarToast('Todas las quejas han sido leidas');
            this.quejas = [];
            // this.cargarQuejas();
          }
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  cargarQuejas() {
    this.trabajosService.getQuejas()
      .subscribe(res => {
        this.quejas.push(...res.quejas);
      });
  }

  recargar( event) {
    this.trabajosService.getQuejas()
    .subscribe(res => {
      event.target.complete();
      this.quejas = [];
      this.quejas.push(...res.quejas);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { TrabajosService } from '../../services/trabajos.service';
import { ActionSheetController } from '@ionic/angular';
import { UiserviceService } from '../../services/uiservice.service';
import { Sugerencia } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  sugerencias: Sugerencia[] = [];
  constructor(private trabajoService: TrabajosService,
              public actionSheetController: ActionSheetController,
              private uiService: UiserviceService) { }

  ngOnInit() {
    this.generarSugerencias();
  }



  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Marcar sugerencias como leídas',
        icon: 'book',
        handler: () => {
          const leidas = this.trabajoService.leerSugerencias();
          if (leidas) {
            this.uiService.presentarToast('Todas las sugerencias han sido leidas');
            this.sugerencias = [];
            // this.generarSugerencias();
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
  generarSugerencias() {
    this.trabajoService.getSugerencias()
      .subscribe((res) => {
        this.sugerencias.push( ... res.sugerencias);
      });
  }
  recargar(event) {
    this.trabajoService.getSugerencias()
      .subscribe((res) => {
      event.target.complete();
      this.sugerencias = [];
      this.sugerencias.push( ... res.sugerencias);
      });
  }
}

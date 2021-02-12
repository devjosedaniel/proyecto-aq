import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ModalController } from '@ionic/angular';
import { DetalleComponent } from '../detalle/detalle.component';
import { TrabajosService } from '../../services/trabajos.service';
import { Trabajo } from '../../interfaces/interfaces';

@Component({
  selector: 'app-trabajo',
  templateUrl: './trabajo.component.html',
  styleUrls: ['./trabajo.component.scss'],
})


export class TrabajoComponent implements OnInit {
  @Input() trabajo: Trabajo;
  foto = '';
  clase = '';
  constructor(private modalCtrl: ModalController, private trabajoService: TrabajosService) { }
  color = '';
  ngOnInit() {
    if ( this.trabajo.sincronizar === 1) {

      this.clase = 'offline';
    }
    this.foto = 'https://aquagardens.com.ec/administrador/img/personal/' + this.trabajo.foto;
    switch (this.trabajo.estado) {
      case 'PENDIENTE':
        this.color = 'warning';
        break;
      case 'INICIADO':
        this.color = 'primary';
        break;
      case 'EN CAMINO':
        this.color = 'secondary';
        break;
      case 'TERMINADO':
        this.color = 'success';
        break;
      case 'CANCELADO':
        this.color = 'danger';
        break;
      default:
        this.color = 'primary';
        break;
    }
    // const foto = environment.url + '/cargarfoto.php?foto=' + this.trabajo.foto;
    // console.log(this.trabajo);
  }
  async verDetalle() {
    const modal = await this.modalCtrl.create({
      component: DetalleComponent,
      componentProps: {
        trabajo : this.trabajo
      }
    });
    modal.present();
  }



  async sincronizar() {
    await this.trabajoService.sincronizarTrabajo(this.trabajo);
  }
}

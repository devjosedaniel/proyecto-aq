import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { OrdenesService } from '../../services/ordenes.service';
import { OrdenPago, Usuario } from '../../interfaces/interfaces';
import { DetalleOrdenComponent } from '../../components/detalle-orden/detalle-orden.component';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.page.html',
  styleUrls: ['./ordenes.page.scss'],
})
export class OrdenesPage implements OnInit {
  usuario: Usuario;
  ordenes: OrdenPago[] = [];
  // tslint:disable-next-line: max-line-length
  constructor(public modalController: ModalController, public loadingController: LoadingController, private usuarioSrv: UsuarioService, private ordenesSrv: OrdenesService) { }

  async ngOnInit() {
    this.usuario = await this.usuarioSrv.cargarUsuario();
    this.presentLoading();
    this.ordenesSrv.getOrdenes(this.usuario.idreferencia).subscribe( (res: any) => {
      // console.log(res);
      this.loadingController.dismiss();
      if ( res.status === 'correcto') {
        this.ordenes.push( ... res.ordenes);
      }
    }, err => {
      this.loadingController.dismiss();
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Por favor, espere...',
    });
    await loading.present();
  }
  async presentModal(orden: OrdenPago) {
    const modal = await this.modalController.create({
      component: DetalleOrdenComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        orden
      }
    });
    return await modal.present();
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrdenPago } from '../../interfaces/interfaces';
import { UiserviceService } from '../../services/uiservice.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.scss'],
})
export class DetalleOrdenComponent implements OnInit {
  aceptacion = false;
  constructor(public modalController: ModalController, private uiSrv: UiserviceService, private iab: InAppBrowser) { }
  @Input() orden: OrdenPago;
  ngOnInit() { }

  regresar() {
    this.modalController.dismiss();
  }
  validar() {
    if (!this.aceptacion) {
      this.uiSrv.alertaInformativa('Antes debe aceptar nuestros términos y condiciones.');
      return;
    }
  }
  verTerminos() {
    this.iab.create('https://aquagardens.com.ec/terminos.php', '_system');
  }
  verPoliticas() {
    this.iab.create('https://aquagardens.com.ec/politicas.php', '_system');
  }
}

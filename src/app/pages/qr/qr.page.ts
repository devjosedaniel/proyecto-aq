import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../interfaces/interfaces';
const URL = environment.url;
@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {
  usuario: Usuario;
  imgQr = '';
  constructor(private usuarioService: UsuarioService) { }
  slideOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };
  async ngOnInit() {
    this.usuario = await this.usuarioService.cargarUsuario();
    this.imgQr = 'https://aquagardens.com.ec/administrador/img/qr/' + this.usuario.qr;
  }

}

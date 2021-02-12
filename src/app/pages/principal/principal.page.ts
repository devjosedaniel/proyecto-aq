import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Usuario } from '../../interfaces/interfaces';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  usuario: Usuario;
  redirecTo = '';
  redirectChat = '';
  constructor(private menuCtrl: MenuController,
              private usuarioService: UsuarioService,
              private alertController: AlertController,
              private iab: InAppBrowser) { }

  async ngOnInit() {

    this.usuario = await this.usuarioService.cargarUsuario();
    if (this.usuario) {
      switch (this.usuario.idrol) {
        case '1':
          this.redirecTo = '/main/tabs/tab1';
          this.redirectChat = '/admin-mensaje';
          break;
        case '2':
          this.redirecTo = '/cliente';
          break;
        case '3':
          this.redirecTo = '/encargado';
          this.redirectChat = '/mensajes';
          break;

        default:
          this.redirecTo = '/login';
          break;
      }
    } else {
      this.redirecTo = '/login';
    }

  }

  async ionViewWillEnter() {
    // this.usuario = null;
    // this.usuario = await this.usuarioService.cargarUsuario();
    // console.log(this.usuario);
  }
  async ionViewDidEnter() {
    // this.usuario = null;
    this.usuario = await this.usuarioService.cargarUsuario();
    // console.log(this.usuario);
  }
  mostrarmenu() {
    this.menuCtrl.toggle();
  }

  async salir() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Está seguro que desea cerrar su sesión?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.usuarioService.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  creador() {
    this.iab.create('https://devdesignec.com/', '_system');
  }
}

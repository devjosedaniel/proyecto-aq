import { Component, OnInit, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() nombre: string;
  @Input() idrol: string;
  redirecTo = '';
  constructor(private alertController: AlertController, private usuarioService: UsuarioService) { }
  rol = null;
   ngOnInit() {

    // console.log(this.usuario);
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

}

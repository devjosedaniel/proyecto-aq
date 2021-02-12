import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController, LoadingController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UiserviceService } from '../../services/uiservice.service';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('slideprincipal', { static: true }) slides: IonSlides;
  // tslint:disable-next-line: max-line-length
  constructor(private loadingController: LoadingController, private usuarioService: UsuarioService, private navController: NavController, private uiService: UiserviceService) { }
  loginUsuario = {
    usuario: '',
    password: ''
  };
  usuario: Usuario = null;
  ngOnInit() {
    this.slides.lockSwipes(true);
  }
  async login(fLogin: NgForm) {
    if (fLogin.invalid) { return; }
    this.presentLoading();
    const valido = await this.usuarioService.login(this.loginUsuario.usuario, this.loginUsuario.password);
    this.loadingController.dismiss();
    if (valido) {
      this.usuario = this.usuarioService.usuario;
      switch (this.usuario.idrol) {
        case '1':
          this.navController.navigateRoot('/main/tabs/tab1', { animated: true });
          break;
        case '2':
          this.navController.navigateRoot('/cliente', { animated: true });
          break;
        case '3':
          this.navController.navigateRoot('/encargado', { animated: true });
          break;
        default:
          break;
      }
    } else {
      this.uiService.alertaInformativa('Usuario o contraseña no son correctos');
    }
  }



  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Validando información...',
    });
    await loading.present();
  }
}

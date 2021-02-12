import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
// import { setInterval } from 'timers';
import { UsuarioService } from '../../services/usuario.service';
import { MensajeService } from '../../services/mensaje.service';
// import { setInterval, clearInterval } from 'timers';
import { Mensaje, Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit, OnDestroy {
  mensajes: Mensaje[] = [];
  usuarioActual = '';
  nuevoMensaje = '';
  intrv;
  @ViewChild(IonContent, { static: true }) content: IonContent;
  constructor(private navCtrl: NavController, private usuarioService: UsuarioService, private mensajeService: MensajeService) { }
  usuario: Usuario;
  async ngOnInit() {
    this.usuario = await this.usuarioService.cargarUsuario();
    this.usuarioActual = this.usuario.nombrereal;

  }
  ngOnDestroy() {
   clearInterval(this.intrv);
  }
  ionViewWillLeave() {
    clearInterval(this.intrv);
  }
  async ionViewDidEnter() {
    this.usuario = await this.usuarioService.cargarUsuario();
    this.usuarioActual = this.usuario.nombrereal;
    this.mensajeService.obtenerMensajes(this.usuario.id).subscribe((res: any) => {
      if (res.status === 'correcto') {
        this.mensajes = [];
        this.mensajes.push( ... res.mensajes);
        setTimeout(() => {
          this.content.scrollToBottom(200);
        });
      }
    });
    this.intrv = setInterval((interval) => {
      this.mensajeService.obtenerMensajesNuevos(this.usuario.id).subscribe((res: any) => {
        if (res.status === 'correcto') {
          this.mensajes.push( ... res.mensajes);
          setTimeout(() => {
            this.content.scrollToBottom(200);
          });
        }
      });
    }, 5000);
  }
  enviarMensaje() {
    if (this.nuevoMensaje.length > 0) {
      this.mensajeService.enviarMensaje(this.usuario.id, '1', this.nuevoMensaje, this.usuario.nombrereal).subscribe((res: any) => {
        // console.log(res);
        if (res.status === 'correcto') {
          this.mensajes.push({
            usuario: this.usuario.nombrereal,
            texto: this.nuevoMensaje,
            hora: ''
          });
          this.nuevoMensaje = '';
          // baja hasta el final del contenido
          setTimeout(() => {
            this.content.scrollToBottom(200);
          });
        }
      });
    }
  }
  getMensajes() {
    console.log('dsadsa');
  }
  regresar() {
    clearInterval(this.intrv);
    // clearInterval(this.int);
    this.navCtrl.navigateForward('/principal');
  }
}

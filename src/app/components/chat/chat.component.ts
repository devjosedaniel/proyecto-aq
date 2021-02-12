import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { MensajeService } from '../../services/mensaje.service';
import { UsuarioService } from '../../services/usuario.service';
import { Mensaje, Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  nuevoMensaje = '';
  // tslint:disable-next-line: max-line-length
  constructor(private modalController: ModalController, private mensajeService: MensajeService, private usuarioService: UsuarioService) { }
  @ViewChild(IonContent, { static: true }) content: IonContent;
  @Input() chat: Mensaje;
  mensajes: Mensaje[] = [];
  usuario: Usuario;
  usuarioActual = '';
  intrv;
  ngOnDestroy() {
    clearInterval(this.intrv);
   }
   ionViewWillLeave() {
     clearInterval(this.intrv);
   }
  async ngOnInit() {
    this.usuario = await this.usuarioService.cargarUsuario();
    this.usuarioActual = this.usuario.nombrereal;
    // this.audio.pr eloadSimple('mensaje', 'assets/audiomsg.mp3');
  }
  async ionViewWillEnter() {
    this.usuario = await this.usuarioService.cargarUsuario();
    this.usuarioActual = this.usuario.nombrereal;

    this.mensajeService.obtenerMensajes(this.chat.idremitente).subscribe((res: any) => {
      if (res.status === 'correcto') {

        this.mensajes = [];
        this.mensajes.push(...res.mensajes);
        this.reajustarLista();
      }
    });

    this.intrv = setInterval((interval) => {
      this.mensajeService.obtenerMensajesNuevosdeusuario(this.chat.idremitente).subscribe((res: any) => {

        if (res.status === 'correcto') {
          this.mensajes.push( ... res.mensajes);
          setTimeout(() => {
            this.content.scrollToBottom(200);
          });
          // const msn: any[] = [];
          // msn.push( ... res.mensajes);
          // if (msn.length > 0) {
          //   this.audio.play('mensaje');
          // }
        }
      });
    }, 5000);
  }
  enviarMensaje() {
    if (this.nuevoMensaje.length > 0) {
      // tslint:disable-next-line: max-line-length
      this.mensajeService.enviarMensaje(this.usuario.id, this.chat.idremitente, this.nuevoMensaje, this.usuario.nombrereal).subscribe((res: any) => {
        // console.log(res);
        if (res.status === 'correcto') {
          this.mensajes.push({
            usuario: this.usuario.nombrereal,
            texto: this.nuevoMensaje,
            hora: ''
          });
          this.nuevoMensaje = '';
          // baja hasta el final del contenido
          this.reajustarLista();
        }
      });
    }
  }
  regresar() {
    this.modalController.dismiss();
  }
  reajustarLista() {
    setTimeout(() => {
      this.content.scrollToBottom(200);
    });
  }
}

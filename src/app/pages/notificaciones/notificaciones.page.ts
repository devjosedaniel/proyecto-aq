import { Component, OnInit, ApplicationRef } from '@angular/core';
import { PushService } from '../../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  mensajes: OSNotificationPayload[] = [];
  constructor(private pushService: PushService, private applicationRef: ApplicationRef) { }

  ngOnInit() {
    this.pushService.pushListener.subscribe(noti => {
      this.mensajes.unshift(noti);
      // renderiza manualmente la pagina - asi como un will enter
      this.applicationRef.tick();
    });
  }
  async ionViewWillEnter() {
    this.mensajes = await this.pushService.getMensajes();
  }

  async borrarMensaje() {
    await this.pushService.borrarMensajes();
    this.mensajes = [];
  }
}

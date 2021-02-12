import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  userId: string;
  mensajes: OSNotificationPayload[] = [
    // {
    //   title: 'Titulo de push',
    //   body: 'body de la push',
    //   date: new Date()
    // }
  ];
  pushListener = new EventEmitter<OSNotificationPayload>();
  constructor(private oneSignal: OneSignal, private storage: Storage) {
    this.cargarMensajes();
   }

  configuracionInicial() {
    this.oneSignal.startInit('3781af1f-858a-4388-8203-6c6e00fe8acc', '970795527973');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
      // do something when notification is received
      console.log('notificacion recibida ', noti);
      this.notificacionRecibida(noti);
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (noti) => {
      // do something when a notification is opened
      console.log('notificacion abierta ', noti);
      await this.notificacionRecibida(noti.notification);
    });
    //  obtener id del suscriptor
    this.oneSignal.getIds().then(info => {
      this.userId = info.userId;
      console.log('userid', this.userId);
      if (this.userId.length > 0) {
        this.storage.set('userId', this.userId);
      }
    });
    this.oneSignal.endInit();
  }


  async notificacionRecibida(noti: OSNotification) {

    await this.cargarMensajes();
    const payload = noti.payload;

    const existe = this.mensajes.find( mensaje => mensaje.notificationID === payload.notificationID);
    if (existe) {
      return;
    }

    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);
    this.guardarMensajes();
  }


  guardarMensajes() {
    this.storage.set('notificaciones', this.mensajes);
  }
  async cargarMensajes() {
    this.mensajes = await this.storage.get('notificaciones') || [];
    return this.mensajes;
  }
  async getMensajes() {
    await this.cargarMensajes();
    return [...this.mensajes];
  }

  async borrarMensajes() {
    await this.storage.remove('notificaciones');
    this.mensajes = [];
    this.guardarMensajes();
  }
}

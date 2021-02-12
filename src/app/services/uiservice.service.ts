import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiserviceService {

  constructor(private alertController: AlertController, private toastController: ToastController) { }

  async alertaInformativa(message: string) {
    const alert = await this.alertController.create({
      message,
      header: 'Aquagardens',
      buttons: ['OK']
    });

    await alert.present();
  }
  async noConexion() {
    this.alertaInformativa('Error de conexión, intentenlo nuevamente...');
  }

  async presentarToast(message) {
    const toast = await this.toastController.create({
      message,
      mode: 'ios',
      color: 'dark',
      position: 'top',
      animated: true,
      duration: 2000
    });
    toast.present();
  }
}

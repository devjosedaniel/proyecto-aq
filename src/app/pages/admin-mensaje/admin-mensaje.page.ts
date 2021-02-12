import { Component, OnInit } from '@angular/core';
import { MensajeService } from '../../services/mensaje.service';
import { ModalController } from '@ionic/angular';
import { ChatComponent } from '../../components/chat/chat.component';
import { Mensaje } from '../../interfaces/interfaces';

@Component({
  selector: 'app-admin-mensaje',
  templateUrl: './admin-mensaje.page.html',
  styleUrls: ['./admin-mensaje.page.scss'],
})
export class AdminMensajePage implements OnInit {

  constructor(private mensajeService: MensajeService, public modalController: ModalController) { }
  chats: Mensaje[] = [];
  async ngOnInit() {
    await this.mensajeService.obtenerUsuarios().subscribe((res: any) => {
      this.chats.push( ... res.chats);
    });
  }
  async abrirChat(chat: Mensaje) {
    const modal = await this.modalController.create({
      component: ChatComponent,
      componentProps: {
        chat
      }
    });
    return await modal.present();
  }
}

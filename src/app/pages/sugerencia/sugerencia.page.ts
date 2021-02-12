import { Component, OnInit } from '@angular/core';
import { SugerenciaService } from '../../services/sugerencia.service';
import { UiserviceService } from '../../services/uiservice.service';

@Component({
  selector: 'app-sugerencia',
  templateUrl: './sugerencia.page.html',
  styleUrls: ['./sugerencia.page.scss'],
})
export class SugerenciaPage implements OnInit {

  constructor(private sugerenciaService: SugerenciaService, private uiService: UiserviceService) { }

  sugerencia = {
    mensaje: ''
  };
  ngOnInit() {
  }
  async enviar() {
    const envio = await this.sugerenciaService.crearSugerencia(this.sugerencia.mensaje);
    if ( envio) {
      this.uiService.presentarToast('Sugerencia enviada correctamente');
      this.sugerencia.mensaje = '';
    } else {
      this.uiService.presentarToast('No se pudo enviar su sugerencia');
    }
  }
}

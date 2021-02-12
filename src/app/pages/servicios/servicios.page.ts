import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import { Servicio } from '../../interfaces/interfaces';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  constructor(private servicioService: ServiciosService) { }
  servicios: Servicio[] = [];
  async ngOnInit() {
    await this.servicioService.getServiciosStorage().then( res => {
      // console.log(res);
      this.servicios.push ( ... res);
    });
  }

}

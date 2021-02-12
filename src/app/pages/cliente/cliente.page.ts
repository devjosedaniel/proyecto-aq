import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { TrabajosService } from '../../services/trabajos.service';
import { UiserviceService } from '../../services/uiservice.service';
import { Trabajo, Usuario, RespTrabajos } from '../../interfaces/interfaces';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  constructor(private usuarioService: UsuarioService, private trabajoService: TrabajosService, private uiService: UiserviceService) { }
  usuario: Usuario;
  trabajos: Trabajo[] = [];
  async ngOnInit() {
    this.usuario = await this.usuarioService.cargarUsuario();
    // console.log(this.usuario);
    await this.cargar();
    this.verificarTerminados();

  }
  ionViewWillEnter() {

  }
  cargar() {
    this.trabajoService.getTrabajosCliente(this.usuario.idreferencia)
      .subscribe((res: RespTrabajos) => {
        // console.log(res);
        this.trabajos.push(...res.trabajos);
        for (const t of this.trabajos) {
          if (t.estado === 'TERMINADO' && t.calificacion === '0') {
            this.uiService.alertaInformativa('Ayudenos a mejorar, calificando los trabajos terminados.');
            break;
          }
        }
      }, err => {
        this.uiService.noConexion();
      });
  }
  verificarTerminados() {
    console.log(this.trabajos);

  }
}

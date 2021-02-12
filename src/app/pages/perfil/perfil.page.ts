import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: Usuario;
  constructor(private usuarioSrv: UsuarioService) {
  }

  async ngOnInit() {
    this.usuario = await this.usuarioSrv.cargarUsuario();
  }

}

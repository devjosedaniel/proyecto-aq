import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { NavController } from '@ionic/angular';
import { UiserviceService } from './uiservice.service';
import { ResLogin, Usuario } from '../interfaces/interfaces';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario = {};
  userId: string;
  constructor(private http: HttpClient,
              private storage: Storage,
              private navCtrl: NavController,
              private uiService: UiserviceService) {
                this.storage.get('userId').then( res => {
                  this.userId = res;
                });

               }




  login(usuario: string, clave: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });



    return new Promise(resolve => {

      this.http.post<ResLogin>(`${URL}/usuarios.php`, 'validarusuario=1&usuario=' + usuario
       + '&clave=' + clave + '&token=' + this.userId, { headers })
        .subscribe(res => {
          // console.log(res);

          if (res.status === 'correcto') {
            this.guardarUsuario(res.usuario);
            resolve(true);
          } else {
            this.usuario = null;
            this.storage.clear();
            resolve(false);
          }
        }, err => {
          this.uiService.noConexion();
        });


    });
  }

  async guardarUsuario(usuario: Usuario) {
    this.usuario = usuario;
    await this.storage.set('usuario', usuario);
  }

  async validaExisteUsuario(): Promise<boolean> {
    await this.cargarUsuario();
    return new Promise<boolean>(resolve => {
      if (this.usuario) {
        resolve(true);
      } else {
        this.navCtrl.navigateRoot('/login');
        resolve(false);
      }

    });
  }

  async cargarUsuario() {
    this.usuario = await this.storage.get('usuario') || null;
    return this.usuario;
  }


  logout() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    this.http.post(`${URL}/dispositivos.php`, `eliminardispositivo=${this.userId}`, { headers}).subscribe( res => {
      this.usuario = null;
      this.storage.clear();
      this.navCtrl.navigateRoot('/login', { animated: true });
    }, err => {
      this.uiService.noConexion();
    });
  }
  EnviarUbicacion(idencargado: string, latitud: number, longitud: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post(`${URL}/trabajos_encargado.php`,
      'miubicacion=' + idencargado + '&latitud=' + latitud + '&longitud=' + longitud,
      { headers }).subscribe(res => {
        console.log(res);
      });
  }
}

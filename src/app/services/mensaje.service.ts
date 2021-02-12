import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})

export class MensajeService {

  constructor(private http: HttpClient) { }

  obtenerMensajes(id) {
    // console.log(id);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`${URL}/mensajes.php`,
      'obtenermensaje=' + id ,
      { headers });
  }
  obtenerUsuarios() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`${URL}/mensajes.php`,
      'obtenerusuarioschat=1' ,
      { headers });
  }
  obtenerMensajesNuevos(id) {
    // console.log(id);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`${URL}/mensajes.php`,
      'obtenermensajesnuevos=' + id ,
      { headers });
  }
  obtenerMensajesNuevosdeusuario(id) {
    // console.log(id);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`${URL}/mensajes.php`,
      'obtenermensajesnuevosdeusuario=' + id ,
      { headers });
  }
  enviarMensaje(idremitente, iddestino, mensaje, nombre) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`${URL}/mensajes.php`,
      'enviarmensaje=1&idremitente=' + idremitente + '&iddestino=' + iddestino + '&mensaje=' + mensaje + '&nombre=' + nombre,
      { headers });
  }
}

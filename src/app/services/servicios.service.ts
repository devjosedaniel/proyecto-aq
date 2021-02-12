import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { Servicio, ResServicio } from '../interfaces/interfaces';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(private http: HttpClient, private storage: Storage) { }
  servicios: Servicio[] = [];


  getServicios() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    this.http.post(`${URL}/servicios.php`, 'listarservicios=1', { headers }).subscribe((res: ResServicio) => {
      if (res.status === 'correcto') {
        this.servicios.push(...res.servicios);
        this.agregarServicios(this.servicios);
      }
    });
  }
  async getServiciosStorage() {
    const servicios: Servicio[] = await this.storage.get('servicios');
    return servicios || null;
  }
  async agregarServicios(servicios: Servicio[]) {

    if (servicios.length > 0) {
      await this.storage.remove('servicios');
      this.storage.set('servicios', servicios);
    }

  }
}

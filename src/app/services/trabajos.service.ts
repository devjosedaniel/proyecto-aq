import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FTP } from '@ionic-native/ftp/ngx';
import { LoadingController } from '@ionic/angular';
import { UiserviceService } from './uiservice.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Trabajo, RespUbicaciones, ResQuejas, ResSugerencia, RespTrabajos } from '../interfaces/interfaces';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TrabajosService {
  ForzarRecargar = new EventEmitter(false);
  constructor(private http: HttpClient,
    // tslint:disable-next-line: deprecation
              private fileTransfer: FileTransfer,
              private loadingCtrl: LoadingController,
              private uiService: UiserviceService,
              private storage: Storage,
              private ftp: FTP) { }
  trabajosStorage: Trabajo[];
  trabajosOffline: Trabajo[] = [];
  getTrabajos() {
    const datos = {
      listartrabajos: '1'
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<RespTrabajos>(`${URL}/trabajos.php`, 'listartrabajos=1', { headers });
  }
  getTrabajosEncargado(id) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<RespTrabajos>(`${URL}/trabajos_encargado.php`, 'idencargado=' + id, { headers });
  }

  getTrabajosCliente(id) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<RespTrabajos>(`${URL}/trabajos_cliente.php`, 'listartrabajos=' + id, { headers });
  }

  async getTrabajosStorage() {
    this.trabajosStorage = [];
    this.trabajosStorage = await this.storage.get('trabajos');
    return this.trabajosStorage || null;
  }
  async guardarTrabajosEncargado(trabajos: Trabajo[]) {
    if (trabajos.length > 0) {
      await this.storage.remove('trabajos');
      await this.storage.set('trabajos', trabajos);
    }

  }
  calificarServicio(idtrabajo: string, valor: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`${URL}/calificacion.php`, 'calificarservicio=' + idtrabajo + '&calificacion=' + valor, { headers });
  }

  reportarTrabajo(idtrabajo: string, queja: string, foto: string = '') {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`${URL}/quejas.php`, 'agregarqueja=' + idtrabajo + '&texto=' + queja + '&foto=' + foto,
     { headers });
  }
  enCamino(trabajo: Trabajo) {
    return new Promise(resolve => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      this.http.post<RespTrabajos>(`${URL}/trabajos_encargado.php`,
        'encamino=' + trabajo.idtrabajo,
        { headers }).subscribe((res: any) => {
          if (res.status === 'correcto') {
            this.ForzarRecargar.emit(true);
            resolve(true);
          } else {
            resolve(false);
          }
        }, async err => {
          // this.uiService.noConexion();
          await this.offline_encamino(trabajo);
          this.ForzarRecargar.emit(true);
          resolve(true);
        });
    });
  }

  reiniciarTrabajo(id) {
    return new Promise(resolve => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      this.http.post<RespTrabajos>(`${URL}/trabajos_encargado.php`,
        'reiniciartrabajo=' + id,
        { headers }).subscribe((res: any) => {
          if (res.status === 'correcto') {
            this.ForzarRecargar.emit(true);
            resolve(true);
          } else {
            this.uiService.alertaInformativa(res.mensaje);
            resolve(false);
          }
        }, err => {
          this.uiService.noConexion();
        });
    });
  }
  iniciarTrabajo(id, latitud, longitud, trabajo: Trabajo) {

    return new Promise(async resolve => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      trabajo.latitud = latitud;
      trabajo.longitud = longitud;
      // trabajo.dateLlegada = new Date();
      if (trabajo.sincronizar === 1) {
        await this.offline_iniciar(trabajo);
        this.ForzarRecargar.emit(true);
        resolve(true);
      } else {
        this.http.post<RespTrabajos>(`${URL}/trabajos_encargado.php`,
          'iniciartrabajo=' + id + '&latitud=' + latitud + '&longitud=' + longitud,
          { headers }).subscribe((res: any) => {
            if (res.status === 'correcto') {
              this.ForzarRecargar.emit(true);
              resolve(true);
            } else {
              resolve(false);
            }
          }, async err => {
            // this.uiService.noConexion();
            await this.offline_iniciar(trabajo);
            this.ForzarRecargar.emit(true);
            resolve(true);
          });
      }
    });

    this.ForzarRecargar.emit(true);
  }
  terminarTrabajo(idtrabajo: string, observacion: string, nombreImg, checklist: string[]) {
    return new Promise(async resolve => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      await this.http.post<RespTrabajos>(`${URL}/trabajos_encargado.php`,
        'terminartrabajo=' + idtrabajo + '&observacion=' + observacion + '&foto1=' + nombreImg + '&checklist=' + JSON.stringify(checklist),
        { headers })
        .subscribe((res: any) => {
          if (res.status === 'correcto') {
            //  obliga a recargar pagina
            this.ForzarRecargar.emit(true);
            resolve(true);
          } else {
            resolve(false);
          }
        }, err => {
          this.uiService.noConexion();
        });
    });
  }
  subirImagen<Boolean>(img: string, nombreImg: string) {


    return new Promise((resolve) => {
      this.ftp.connect('ftp.aquagardens.com.ec', 'fileupload@aquagardens.com.ec', 'gJDqLVax#@Tn')
        .then((res: any) => {
          this.ftp.upload(img, '/' + nombreImg).subscribe(resp => {
            this.uiService.presentarToast('Subido ' + (resp * 100).toFixed() + '%');
            if (resp === 1) {
              // this.loadingCtrl.dismiss();
              resolve(true);
            }
          });
        })
        .catch((error: any) => {
          this.uiService.noConexion();
          resolve(false);
        });

    });
  }
  getSugerencias() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<ResSugerencia>(`${URL}/sugerencias.php`, 'listarsugerencias=1', { headers });
  }

  getQuejas() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<ResQuejas>(`${URL}/quejas.php`, 'listasquejas=1', { headers });
  }
  leerQuejas<Promise>() {
    return new Promise(async resolve => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      await this.http.post(`${URL}/quejas.php`, 'leerquejas=1', { headers }).
        subscribe((res: any) => {
          if (res.status === 'correcto') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }
  leerSugerencias<Promise>() {
    return new Promise(async resolve => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      await this.http.post(`${URL}/sugerencias.php`, 'leersugerencias=1', { headers }).
        subscribe((res: any) => {
          if (res.status === 'correcto') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }



  async progressAlert() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
    });
    await loading.present();

  }

  cerrarProgressAlert() {
    this.loadingCtrl.dismiss();
  }
  Ubicaciones() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<RespUbicaciones>(`${URL}/trabajos_encargado.php`, 'ultimaubicacion=1', { headers });
  }

  async getTrabajosSincronizar() {
    this.trabajosStorage = await this.getTrabajosStorage();
    let trabajosUpdate: Trabajo[] = [];
    if (this.trabajosStorage) {
      trabajosUpdate = this.trabajosStorage.filter(t => {
        if (t.sincronizar === 1) {
          return t;
        }
      });
    }
    return trabajosUpdate;
  }






  //  FUNCIONES OFFLINE --- REVISAR CON CUIDADO

  async offline_encamino(trabajo: Trabajo) {
    const trabajoUpdt: Trabajo = trabajo;
    trabajoUpdt.sincronizar = 1;
    trabajoUpdt.idestado = '4';
    trabajoUpdt.estado = 'EN CAMINO';
    await this.agregarOReemplazarOffline(trabajoUpdt);

  }
  async offline_iniciar(trabaja: Trabajo) {
    const trabajoUpdt: Trabajo = trabaja;
    trabajoUpdt.sincronizar = 1;
    trabajoUpdt.idestado = '2';
    trabajoUpdt.estado = 'INICIADO';
    trabajoUpdt.dateLlegada = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(trabajoUpdt.dateLlegada);
    await this.agregarOReemplazarOffline(trabajoUpdt);
  }

  async offline_terminar(trabajo: Trabajo) {
    const trabajoUpdt: Trabajo = trabajo;
    trabajoUpdt.sincronizar = 1;
    trabajoUpdt.idestado = '3';
    trabajoUpdt.estado = 'TERMINADO';
    trabajoUpdt.dateSalida = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(trabajoUpdt.dateSalida);
    await this.agregarOReemplazarOffline(trabajoUpdt);
    this.ForzarRecargar.emit(true);
  }

  async getTrabajosOffline() {
    this.trabajosOffline = [];
    this.trabajosOffline = await this.storage.get('offline') || [];
    return this.trabajosOffline || null;
  }

  async agregarOReemplazarOffline(trabajo: Trabajo) {
    this.trabajosOffline = await this.getTrabajosOffline();
    if (this.trabajosOffline) {
      this.trabajosOffline = this.trabajosOffline.filter(t => {
        if (t.idtrabajo !== trabajo.idtrabajo) {
          return t;
        }
      });
      this.trabajosOffline.unshift(trabajo);
    } else {
      this.trabajosOffline.push(trabajo);
    }
    this.storage.set('offline', this.trabajosOffline);
  }
  async eliminarOffline(trabajo: Trabajo) {
    this.trabajosOffline = await this.getTrabajosOffline();
    if (this.trabajosOffline) {
      this.trabajosOffline = this.trabajosOffline.filter(t => {
        if (t.idtrabajo !== trabajo.idtrabajo) {
          return t;
        }
      });
    }
    this.storage.set('offline', this.trabajosOffline);
  }



  async sincronizarTrabajo(trabajo: Trabajo) {

    this.progressAlert();
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const subida = await this.subirImagen(trabajo.pathimg, trabajo.foto1);
    if (subida) {
      console.log('llegada', trabajo.dateLlegada);
      console.log('salida', trabajo.dateSalida);
      // return;
      await this.http.post(`${URL}/trabajos_encargado.php`,
        'sincronizar=' + trabajo.idtrabajo + '&idestado=' + trabajo.idestado + '&llegada=' + trabajo.dateLlegada
        + '&salida=' + trabajo.dateSalida + '&latitud=' + trabajo.latitud + '&longitud=' + trabajo.longitud
        + '&observacion=' + trabajo.observacion_termino + '&foto=' + trabajo.foto1 + '&checklist=' + JSON.stringify(trabajo.checks),
        { headers }).subscribe(async (res: any) => {
          if (res.status === 'correcto') {
            this.cerrarProgressAlert();
            this.uiService.presentarToast('sincronización exitosa');
            await this.eliminarOffline(trabajo);
            this.ForzarRecargar.emit(true);
          }
        }, err => {
          this.cerrarProgressAlert();
          this.uiService.noConexion();
        });
    } else {
      this.uiService.noConexion();
    }

  }


}




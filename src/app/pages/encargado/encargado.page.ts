import { Component, OnInit } from '@angular/core';
import { TrabajosService } from '../../services/trabajos.service';
import { UsuarioService } from '../../services/usuario.service';
// tslint:disable-next-line: max-line-length
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@ionic-native/network/ngx';
import { UiserviceService } from '../../services/uiservice.service';
import { Trabajo, Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-encargado',
  templateUrl: './encargado.page.html',
  styleUrls: ['./encargado.page.scss'],
})
export class EncargadoPage implements OnInit {
  trabajos: Trabajo[] = [];
  trabajosOffline: Trabajo[];
  usuario: Usuario;
  colorgps = '';


  config: BackgroundGeolocationConfig = {
    // precion de distancia metros 10
    desiredAccuracy: 0,
    // radio en metros a moverse para que se active 20
    stationaryRadius: 0,
    // distancia mimima a moverser para actualizar 30
    distanceFilter: 0,
    notificationTitle: 'Mi ubicación',
    notificationText: 'Activada',
    notificationIconColor: '#3880ff',
    startForeground: true,
    // sonido de movimiento
    debug: false,
    interval: 10000,
    // stopOnTerminate: false

  };

  // tslint:disable-next-line: max-line-length
  constructor(private trabajoService: TrabajosService,
              private usuarioService: UsuarioService,
              private backgroundGeolocation: BackgroundGeolocation,
              private network: Network,
              private ui: UiserviceService) { }

  async ngOnInit() {
    this.usuario = await this.usuarioService.cargarUsuario();
    await this.cargar();
    this.trabajoService.ForzarRecargar.subscribe(async res => {
      if (res) {
        await this.cargar();
      }
    });
    const idreferencia = this.usuario.idreferencia;
    this.backgroundGeolocation.configure(this.config)
      .then(() => {

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(async (location: BackgroundGeolocationResponse) => {
          // console.log('posicion: ', location);
          // console.log('latitud: ' + location.latitude + '- longitud: ' + location.longitude);
          // console.log('idencargado', this.usuario.idreferencia);
          console.log('entre al servicio ahora');
          // this.usuario = await  this.usuarioService.cargarUsuario();
          if (idreferencia) {
            console.log('paso la validacion del usuario');
            await this.usuarioService.EnviarUbicacion(this.usuario.idreferencia, location.latitude, location.longitude);
            console.log('se envio ubicacion');
          } else {
            console.log('se corto el servicio x usuario');
            this.colorgps = '';
            this.backgroundGeolocation.finish();
            this.backgroundGeolocation.stop();
          }
          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
          // this.backgroundGeolocation.finish(); // FOR IOS ONLY
        });

      });
  }
  async ionViewDidEnter() {
    this.network.onDisconnect().subscribe(() => {
      // console.log('network was disconnected :-(');
      this.ui.presentarToast('upss :( , se ha desconectado de internet');
    });
    this.network.onConnect().subscribe(() => {
      // console.log('network connected!');
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          // console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });

    this.backgroundGeolocation.checkStatus().then((res) => {
      if (res.isRunning) {
        this.colorgps = 'primary';
      } else {
        this.colorgps = '';
      }
    });
  }

  recargar(event) {
    this.trabajoService.getTrabajosEncargado(this.usuario.idreferencia)
      .subscribe(async res => {
        event.target.complete();
        this.trabajos = [];
        this.trabajos.push(...res.trabajos);
        this.trabajoService.guardarTrabajosEncargado(res.trabajos);
        // trabajos offline
        this.trabajosOffline = [];
        this.trabajosOffline = await this.trabajoService.getTrabajosOffline();
        if (this.trabajosOffline) {
          // tslint:disable-next-line: no-shadowed-variable
          this.trabajos = this.trabajos.filter(res => {
            let pasa = true;
            for (const off of this.trabajosOffline) {
              if (res.idtrabajo === off.idtrabajo) {
                pasa = false;
                break;
              }
            }
            if (pasa) {
              return res;
            }
          });
          this.trabajos.unshift(...this.trabajosOffline);
        }
      },
        err => {
          event.target.complete();
          this.ui.noConexion();
        });
  }
  async cargar() {
    this.usuario = await this.usuarioService.cargarUsuario();
    this.trabajoService.getTrabajosEncargado(this.usuario.idreferencia)
      .subscribe(async res => {
        if (res) {
          this.trabajos = [];
          this.trabajos.push(...res.trabajos);
          this.trabajoService.guardarTrabajosEncargado(res.trabajos);
          // trabajos offline aunque ya haya internet
          this.trabajosOffline = [];
          this.trabajosOffline = await this.trabajoService.getTrabajosOffline();
          if (this.trabajosOffline) {
            // tslint:disable-next-line: no-shadowed-variable
            this.trabajos = this.trabajos.filter(res => {
              let pasa = true;
              for (const off of this.trabajosOffline) {
                if (res.idtrabajo === off.idtrabajo) {
                  pasa = false;
                  break;
                }
              }
              if (pasa) {
                return res;
              }
            });
            this.trabajos.unshift(...this.trabajosOffline);
          }
        }
      }, async err => {
        this.ui.noConexion();
        this.trabajos = [];
        // cargar trabajos guardados
        this.trabajos = await this.trabajoService.getTrabajosStorage();
        // inicio el modo offline
        this.trabajosOffline = [];
        this.trabajosOffline = await this.trabajoService.getTrabajosOffline();
        console.log(this.trabajosOffline);
        if (this.trabajosOffline) {
          this.trabajos = this.trabajos.filter(res => {
            let pasa = true;
            for (const off of this.trabajosOffline) {
              if (res.idtrabajo === off.idtrabajo) {
                pasa = false;
                break;
              }
            }
            if (pasa) {
              return res;
            }
          });
          this.trabajos.unshift(...this.trabajosOffline);
        }
        // fin de modo offline
      });
  }

  miubicacion() {
    this.backgroundGeolocation.checkStatus().then(res => {
      if (res.isRunning) {
        this.colorgps = '';
        this.backgroundGeolocation.finish();
        this.backgroundGeolocation.stop();
      } else {
        this.colorgps = 'primary';
        this.backgroundGeolocation.start();

      }
    });
  }
}

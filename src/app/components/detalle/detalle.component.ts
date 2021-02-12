import { Component, OnInit, Input, EventEmitter, AfterViewInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { TrabajosService } from '../../services/trabajos.service';
import { UiserviceService } from '../../services/uiservice.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FTP } from '@ionic-native/ftp/ngx';
import { ThrowStmt } from '@angular/compiler';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ChecklistService } from '../../services/checklist.service';
import { Trabajo, CheckList, Usuario } from '../../interfaces/interfaces';


declare var mapboxgl: any;
declare var window: any;
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})

export class DetalleComponent implements OnInit, AfterViewInit {
  @Input() trabajo: Trabajo;
  foto = '';
  ftrabajo = '';
  checklist: CheckList[] = [];
  checkUsados: CheckList[] = [];
  usuario: Usuario = null;
  cargandoGeo = false;
  mensaje = '';
  tempImages = '';
  pathImg = '';
  posicion = false;
  coords = {
    latitud: 0,
    longitud: 0
  };
  queja = '';
  mostrarCalificacion = true;
  mostrarReporte = true;
  constructor(private modalController: ModalController,
              private usuarioService: UsuarioService,
              private trabajoService: TrabajosService,
              private uiService: UiserviceService,
              private camera: Camera,
              private geoLocation: Geolocation,
              private barcodeScanner: BarcodeScanner,
              private alertCtrl: AlertController,
              private checklistSrv: ChecklistService) {
              this.checklistSrv.cargarCheckList();
              }

  async ngOnInit() {
    this.checklist = this.checklistSrv.checkList;
    this.tempImages = '';
    this.foto = 'https://aquagardens.com.ec/administrador/img/personal/' + this.trabajo.foto;
    this.ftrabajo = 'https://aquagardens.com.ec/administrador/img/trabajos/' + this.trabajo.foto1;

    this.usuario = this.usuarioService.usuario;

  }
  ngAfterViewInit() {
    if (this.usuario.idrol === '1' && this.trabajo.estado === 'INICIADO' && this.trabajo.latitud && this.trabajo.longitud) {
      const latitud = parseFloat(this.trabajo.latitud);
      const longitud = parseFloat(this.trabajo.longitud);
      mapboxgl.accessToken =
        'pk.eyJ1Ijoiam9zZWRhbmllbG1hcGJveCIsImEiOiJjazNmNjhubHYwMWVvM25wa3AydGhoNXhhIn0.qTOMe-ue2IletFCVZvPR6w';
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 15.5,
        center: [longitud, latitud]
      });

      const size = 200;
      // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
      // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // get rendering context for the map canvas when layer is added to the map
        // tslint:disable-next-line: object-literal-shorthand
        onAdd: function() {
          const canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext('2d');
        },

        // called once before every frame where the icon will be used
        // tslint:disable-next-line: object-literal-shorthand
        render: function() {
          const duration = 1000;
          const t = (performance.now() % duration) / duration;

          const radius = (size / 2) * 0.3;
          const outerRadius = (size / 2) * 0.7 * t + radius;
          const context = this.context;

          // draw outer circle
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
          context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
          context.fill();

          // draw inner circle
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          context.fillStyle = 'rgba(255, 100, 100, 1)';
          context.strokeStyle = 'white';
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          // update this image's data with data from the canvas
          this.data = context.getImageData(0, 0, this.width, this.height).data;

          // continuously repaint the map, resulting in the smooth animation of the dot
          map.triggerRepaint();

          // return `true` to let the map know that the image was updated
          return true;
        }
      };

      // tslint:disable-next-line: only-arrow-functions
      map.on('load', function() {
        map.resize();
        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

        map.addLayer({
          id: 'points',
          type: 'symbol',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [longitud, latitud]
                  }
                }
              ]
            }
          },
          layout: {
            'icon-image': 'pulsing-dot'
          }
        });
      });

    }
  }
  async ionViewDidEnter() {

    this.usuario = this.usuarioService.usuario;
    // console.log(this.trabajo);
  }
  regresar() {
    this.modalController.dismiss();
  }
  async enCamino() {
    const camino = await this.trabajoService.enCamino(this.trabajo);
    if (camino) {
      this.modalController.dismiss();
      this.uiService.presentarToast('Correcto, diríjase a la ubicación del trabajo');
    } else {
      this.uiService.presentarToast('Error al dirigirse');
    }
  }
  async reiniciar() {
    const alert = this.alertCtrl.create({
      header: 'Reiniciar',
      message: '¿Está seguro?, esto regresará a pendiente el trabajo...',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: async () => {
            const valido = await this.trabajoService.reiniciarTrabajo(this.trabajo.idtrabajo);
            if (valido) {
              this.modalController.dismiss();
              this.uiService.presentarToast('Trabajo reiniciado');
            } else {
              this.uiService.presentarToast('Error al reiniciar trabajo');
            }
          }
        }
      ]
    });
    (await alert).present();
  }
  async iniciarTrabajo() {
    this.barcodeScanner.scan().then(async barcodeData => {
      // console.log('Barcode data', barcodeData);
      if (barcodeData.cancelled === false) {
        if (barcodeData.text === this.trabajo.codigo_qr) {
          this.uiService.presentarToast('codigo qr correcto');
          // tslint:disable-next-line: max-line-length
          const iniciado = await this.trabajoService.iniciarTrabajo(this.trabajo.idtrabajo, this.coords.latitud, this.coords.longitud, this.trabajo);
          if (iniciado) {
            this.modalController.dismiss();
            this.uiService.presentarToast('Trabajo iniciado');
          } else {
            // this.uiService.presentarToast('Error al iniciar trabajo');
          }
        } else {
          this.uiService.presentarToast('codigo qr incorrecto');
        }
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }
  async terminarTrabajo() {
    const chekeados: string[] = [];
    if ( this.checklist.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.checklist.length; i++) {
        if (this.checkUsados[i] === true) {
          chekeados.push( this.checklist[i].nombre);
        }
      }
    }

    if (this.tempImages === '') {
      this.uiService.alertaInformativa('Debe tomar o elegir una foto');
      return 0;
    }
    if (this.trabajo.sincronizar === 1) {
      // modo offline
      this.trabajo.observacion_termino = this.mensaje;
      this.trabajo.pathimg = this.pathImg;
      this.trabajo.foto1 = this.trabajo.idtrabajo + '.jpg';
      this.trabajo.checks = chekeados;
      await this.trabajoService.offline_terminar(this.trabajo);
      this.trabajoService.cerrarProgressAlert();
      this.modalController.dismiss();
      this.uiService.presentarToast('Trabajo terminado en modo Offline');
    } else {
      this.trabajoService.progressAlert();
      const subido = await this.trabajoService.subirImagen(this.pathImg, this.trabajo.idtrabajo + '.jpg');
      if (subido) {
        // tslint:disable-next-line: max-line-length
        const terminado = await this.trabajoService.terminarTrabajo(this.trabajo.idtrabajo, this.mensaje, this.trabajo.idtrabajo + '.jpg', chekeados);
        if (terminado) {
          this.mensaje = '';
          this.modalController.dismiss();
          this.trabajoService.cerrarProgressAlert();
          this.uiService.presentarToast('Trabajo terminado');
        } else {
          this.trabajoService.cerrarProgressAlert();
          this.uiService.presentarToast('Error al terminar trabajo');
        }
      } else {
        // modo offline
        this.trabajo.observacion_termino = this.mensaje;
        this.trabajo.pathimg = this.pathImg;
        this.trabajo.foto1 = this.trabajo.idtrabajo + '.jpg';
        this.trabajo.checks = chekeados;
        await this.trabajoService.offline_terminar(this.trabajo);
        this.trabajoService.cerrarProgressAlert();
        this.modalController.dismiss();
        this.uiService.presentarToast('Trabajo terminado en modo Offline');
      }
    }




  }
  camara() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    this.procesarImagen(options);
  }

  galeria() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    this.procesarImagen(options);
  }

  procesarImagen(options: CameraOptions) {
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      //  let base64Image = 'data:image/jpeg;base64,' + imageData;
      const img = window.Ionic.WebView.convertFileSrc(imageData);
      // console.log(img);
      this.pathImg = imageData;
      this.tempImages = img;
    }, (err) => {
      // Handle error
    });
  }

  getGeo() {
    if (!this.posicion) {
      this.coords.latitud = 0;
      this.coords.latitud = 0;
      return;
    }
    this.cargandoGeo = true;
    this.geoLocation.getCurrentPosition().then((resp) => {
      this.cargandoGeo = false;
      this.coords.latitud = resp.coords.latitude;
      this.coords.longitud = resp.coords.longitude;

      console.log(this.coords);
    }).catch((error) => {
      console.log('Error getting location', error);
      this.cargandoGeo = false;
    });
  }

  calificar(valor: number) {
    // console.log(valor);
    this.trabajoService.calificarServicio(this.trabajo.idtrabajo, valor)
    .subscribe( (res: any) => {
      if (res.status === 'correcto') {
        this.uiService.alertaInformativa('Gracias por su calificación');
        this.mostrarCalificacion = false;
      }
    }, err => {
      this.uiService.noConexion();
    });
  }

  reportar() {
    this.trabajoService.reportarTrabajo(this.trabajo.idtrabajo, this.queja)
    .subscribe( (res: any) => {
      if (res.status === 'correcto') {
        this.uiService.alertaInformativa('Su reporte ha sido registrado y será atendido con celeridad.');
        this.mostrarReporte = false;
      }
    }, err => {
      this.uiService.noConexion();
    });
  }
}

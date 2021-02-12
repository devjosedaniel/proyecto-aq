import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TrabajosService } from '../../services/trabajos.service';
import { Ubicacion } from '../../interfaces/interfaces';
declare var mapboxgl: any;

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit, AfterViewInit {
  ubicaciones: Ubicacion [] = [];
  constructor(private trabajoService: TrabajosService) { }
  center = {
    latitud: '',
    longitud: ''
  };
  arrayFeatures = [];
  async ngOnInit() {
    await this.cargarValores();
    // console.log(this.ubicaciones);
  }
  ionViewWillEnter() {
    this.cargarValores();
  }
  ngAfterViewInit() {

  }

  cargarValores() {
    this.trabajoService.Ubicaciones().subscribe(res => {
      if (res.status === 'correcto') {

        this.ubicaciones.push(...res.ubicaciones);
        if (this.ubicaciones.length > 0) {
          this.center.latitud = this.ubicaciones[0].latitud;
          this.center.longitud = this.ubicaciones[0].longitud;
          this.cargarMapa();
        }
      }

    });
  }

  cargarMapa() {

    mapboxgl.accessToken =
      'pk.eyJ1Ijoiam9zZWRhbmllbG1hcGJveCIsImEiOiJjazNmNjhubHYwMWVvM25wa3AydGhoNXhhIn0.qTOMe-ue2IletFCVZvPR6w';
    const map = new mapboxgl.Map({
      container: 'map1',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 12,
      center: [this.center.longitud, this.center.latitud]
    });

    for (const a of this.ubicaciones) {
      const features = {
        type: 'Feature',
        properties: {
          description: a.encargado
        },
        geometry: {
          type: 'Point',
          coordinates: [a.longitud, a.latitud]
        }
      };
      this.arrayFeatures.push(features);
    }
    // console.log(this.arrayFeatures);
    const size = 150;
    const geojson = {
      id: 'points',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.arrayFeatures
        }
      },
      layout: {
        'icon-image': 'pulsing-dot'
      }
    };
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
    map.on('load', function(e) {
      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

      map.addLayer(geojson);
    });
    // tslint:disable-next-line: only-arrow-functions
    map.on('click', 'points', function(e) {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);

    });
  }
}

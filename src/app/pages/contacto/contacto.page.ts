import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {

  constructor(private iab: InAppBrowser) { }
  options: {
    allowSlidePrev: false,
    allowSlideNext: false
  };
  ngOnInit() {
  }
  irFacebook() {
    this.iab.create('https://www.facebook.com/aquagardensecu/', '_system');
  }
  irInstagram() {
    this.iab.create('https://www.instagram.com/aquagardens_ec/', '_system');
  }
  irWhatsapp() {
    this.iab.create('https://wa.link/JWO2', '_system');
  }
}

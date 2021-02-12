import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// para consultas http
import { HttpClientModule} from '@angular/common/http';
//  utilizar local storage
import { IonicStorageModule } from '@ionic/storage';
import { ComponentsModule } from './components/components.module';
import { FormsModule } from '@angular/forms';
// camara
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer} from '@ionic-native/file-transfer/ngx';
import { FTP } from '@ionic-native/ftp/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Network } from '@ionic-native/network/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  // tslint:disable-next-line: max-line-length
  imports: [ComponentsModule, FormsModule , BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    // tslint:disable-next-line: deprecation
    FileTransfer,
    BackgroundGeolocation,
    Geolocation,
    BarcodeScanner,
    FTP,
    OneSignal,
    InAppBrowser,
    NativeAudio,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule, Http } from '@angular/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SwiperModule } from 'swiper/angular';
import { Angular4PaystackModule } from 'angular4-paystack';
import { FootpagePageModule } from './footpage/footpage.module';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { FlutterwaveModule } from "flutterwave-angular-v3"
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    Angular4PaystackModule.forRoot('pk_test_26fd4676b5a5d847c70ced4c93968fb9c23c2726'),
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SwiperModule,
    FootpagePageModule,
    SocialLoginModule,
    FlutterwaveModule,
    //  NgxDatatableModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    NavParams,
    Clipboard,
    Deeplinks,
    Market,
    AppVersion,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '286245909592-hog0u6cfm7lsnkg5i8bsfq5urq0k0h61.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

import { Component } from '@angular/core';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { Platform, NavController, ModalController, ToastController, AlertController } from '@ionic/angular';
import { ProductViewPage } from './product-view/product-view.page';
import { TabsPage } from './tabs/tabs.page';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';
import { ProviderService } from './providers/provider.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public platform: Platform,
    private deeplinks: Deeplinks,
    public navy: NavController,
    private router: Router,
    private zone: NgZone,
    private provider: ProviderService,
    private market: Market,
    private modalController: ModalController,
    private appVersion: AppVersion,
    public alertController: AlertController,
  ) {
    this.platform.ready().then(() => {
      //find updates
      this.appVersion.getVersionCode().then(res => {
        //get the version from the server
        this.provider.updateApp().subscribe(resp => {
          if (parseInt(resp.version) > res) {
            //the version code is higher, proceed to download
            //    this.action.alerter(resp.message);
            this.confirm(resp.message);
          }
        })
      }).catch(err => {
        console.log("Sorry, could not fetch app version");
        console.log(err)
      })

      if (this.platform.is("android") || this.platform.is("ios")) {
        this.deeplinks.route({
          '/product-view': ProductViewPage
        }).subscribe(match => {
          console.log(JSON.stringify(match))
          const internalPath = "/product-view?type=" + match.$args.type + "&id=" + match.$args.id + "&shop_id=" + match.$args.shop_id;
          this.zone.run(() => {
            this.router.navigateByUrl(internalPath);
          });

        }, nomatch => {
          console.error('Got a deeplink that didn\'t match', nomatch);
        });
      }
    });
  }

  async confirm(message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Update available',
      message: '<strong>' + message + '</strong>',
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'secondary',
          handler: () => {
            this.market.search("poncube").then(() => {

            }).catch(err => {
              console.log("Sorry, couldn't find app");
              console.log(err)
            })
          }
        }, {
          text: 'Cancel',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  ionViewWillEnter() {

  }
}

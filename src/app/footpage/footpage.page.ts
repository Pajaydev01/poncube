import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent,NavController,Platform} from '@ionic/angular';
import {FootersPage } from '../popover/footers/footers.page';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-footpage',
  templateUrl: './footpage.page.html',
  styleUrls: ['./footpage.page.scss'],
})
export class FootpagePage implements OnInit {

  constructor(  public popoverController: PopoverController,
        public navy: NavController,) { }

  ngOnInit() {
  }

  //show footers for mobile here
  async footie(param,ev){
    const popover = await this.popoverController.create({
  component: FootersPage,
  cssClass: 'bottom-sheet-popover',
  event:ev,
  translucent: true,
  showBackdrop:true,
  componentProps: {
  'type':param
  }
  });
  await popover.present();

  const { role } = await popover.onDidDismiss();
  }

  //direct routes here
  route(param){
    this.navy.navigateRoot(param);
  }

  openInNewTab(url) {
   window.open(url, '_blank').focus();
  }

}

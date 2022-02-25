import { Component, OnInit } from '@angular/core';
import { FootpagePage } from '../footpage/footpage.page';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent,NavController,Platform} from '@ionic/angular';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {

  constructor(
      public navy: NavController,
      private titleService: Title
  ) {
}

  ngOnInit() {
  }

  ionViewWillEnter(){
  this.titleService.setTitle('PONCUBE | Delivery Service'); 
  }


    route(param){
      this.navy.navigateRoot(param);
    }
}

import { Component, OnInit } from '@angular/core';
import { FootpagePage } from '../footpage/footpage.page';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent,NavController,Platform} from '@ionic/angular';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage implements OnInit {

  constructor(
    public navy: NavController,
    private titleService: Title
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
  this.titleService.setTitle('PONCUBE | Privacy Policy');
  }

    route(param){
      this.navy.navigateRoot(param);
    }

}

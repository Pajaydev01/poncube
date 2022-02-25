import { Component, OnInit } from '@angular/core';
import { FootpagePage } from '../footpage/footpage.page';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent,NavController,Platform} from '@ionic/angular';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  constructor(
    public navy: NavController,
    private titleService: Title
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
  this.titleService.setTitle('PONCUBE | FAQ');
  }

    route(param){
      this.navy.navigateRoot(param);
    }
}

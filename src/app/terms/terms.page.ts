import { Component, OnInit } from '@angular/core';
import { FootpagePage } from '../footpage/footpage.page';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent,NavController,Platform} from '@ionic/angular';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

  constructor(
    public navy: NavController,
    private titleService: Title
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
  this.titleService.setTitle('PONCUBE | Terms and conditions');
  }

    route(param){
      this.navy.navigateRoot(param);
    }
}

import { Component, OnInit } from '@angular/core';
import { FootpagePage } from '../footpage/footpage.page';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent,NavController,Platform} from '@ionic/angular';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
scrolled:boolean=true;
  constructor(
    public navy: NavController,
    private titleService: Title
  ) {
this.titleService.setTitle('PONCUBE | About us');
  }

  ngOnInit() {
  }
ionViewWillEnter(){
this.titleService.setTitle('PONCUBE | About us');
}

  route(param){
    this.navy.navigateRoot(param);
  }

}

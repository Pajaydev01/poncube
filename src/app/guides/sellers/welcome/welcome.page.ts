import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @Input() view: any;
  @Input() img: any;
  show1: boolean = true;
  show2: boolean = false;
  show3: boolean;
  constructor(public modalController: ModalController) {

  }

  ngOnInit() {
  }

  next() {
    this.show1 = false;
    this.show2 = true;
    this.show3 = false;
    this.img = '../../../assets/images/IMGBIN_happiness-illustration-png_Dg8gmU6U.png';
  }

  next_2() {
    this.show1 = false;
    this.show2 = false;
    this.show3 = true;
    this.img = '../../../assets/images/IMGBIN_dollars-want-me-paperback-png_BgQKNEK8.png';
  }

  //dismiss modal here
  dismiss() {
    localStorage.setItem('show_guide_user', 'off');
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}

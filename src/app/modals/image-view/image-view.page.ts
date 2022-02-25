import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController, ToastController, IonContent, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.page.html',
  styleUrls: ['./image-view.page.scss'],
})
export class ImageViewPage implements OnInit {
  @Input() img: any;
  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  //dismiss modal here
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
      data: 'run'
    });

  }


}

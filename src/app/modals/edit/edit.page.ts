import { Component, OnInit, Input } from '@angular/core';
import { ProviderService } from '../../providers/provider.service';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent, NavController, ToastController, AlertController, Platform } from '@ionic/angular';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  @Input() firstname: string;
  @Input() lastname: string;
  @Input() address: string;
  @Input() email: string;
  @Input() type: string;
  @Input() phone: any;
  @Input() ig: string;
  @Input() fb: string;
  @Input() tw: string;

  @Input() shop_name: string;
  @Input() caption: string;
  @Input() details: string;
  res_ed: any;
  session_id: any;
  isLoading: boolean;
  res: any;

  constructor(
    public provider: ProviderService,
    public loadingController: LoadingController, public toastController: ToastController, public alertController: AlertController, public modalController: ModalController
  ) {
  }

  ngOnInit() {
  }


  //submit edited details here
  edit() {
    if (this.firstname === "" || this.lastname === "" || this.address === "") {
      this.presentToast("Please fill all the fields");
      return false;
    }
    else {
      this.loadingPresent("Please wait...");
      let body = {
        session_id: localStorage.getItem('session_id'),
        firstname: this.firstname,
        lastname: this.lastname,
        address: this.address,
        email: this.email,
        phone: this.phone
      }
      this.provider.edit_profile(body).subscribe(res => {
        this.res_ed = res;
        if (this.res_ed.message === "success") {
          this.loadingDismiss();
          this.presentToast("Details updated");
          this.dismiss();
        }
        else {
          this.loadingDismiss();
          this.presentToast(this.res_ed.message);
          console.log(this.res_ed.message)
        }
      }, err => {
        this.loadingDismiss();
        this.presentToast(err);
        console.log(err)
      });
    }
  }


  edit_shop() {
    let body = {
      shop_name: this.shop_name,
      caption: this.caption,
      //  shop_details:this.details.split('<br>').join('\n'),
      shop_details: this.details,
      fb: this.fb,
      ig: this.ig,
      tw: this.tw,
      session_id: localStorage.getItem('session_id')
    }
    //upload edited this
    this.loadingPresent("Loading, please wait...");
    this.provider.edit_store(body).subscribe(res => {
      this.res = res;


      if (this.res.message === "success") {
        this.loadingDismiss();
        this.presentToast('Data saved');
        this.dismiss();
      }
      else {
        //  return false;
        this.loadingDismiss();
        this.presentToast(this.res.message)
      }
    }, err => {
      return false;
      console.log(err)
      this.loadingDismiss();
      this.presentToast(err);
    })
  }


  //loading controller here
  async loadingPresent(params) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: params,
      spinner: 'lines'
    }).then(a => {
      a.present().then(() => {
        console.log('loading presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort laoding'));
        }
      });
    });
  }

  //toast controller here
  async presentToast(params) {
    const toast = await this.toastController.create({
      message: params,
      duration: 2000
    });
    toast.present();
  }


  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}

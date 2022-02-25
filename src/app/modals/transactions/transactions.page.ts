import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent,NavController,  ToastController,AlertController} from '@ionic/angular';
import { ProviderService } from '../../providers/provider.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
data:boolean=false;
resp:any;
rows:any;
columns:any;
  constructor(public toastController: ToastController, public provider:ProviderService,public modalController: ModalController,) {

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    let body={
      session_id:localStorage.getItem('session_id')
    }
    this.provider.get_transactions(body).subscribe(res=>{
      this.resp=res;
      if(this.resp.message==="success"){
        this.data=true;
        this.rows=this.resp.data.reverse();

console.log(this.resp.data)
      }
      else{
        this.presentToast(this.resp.message);
        console.log(this.resp.message)
      }
    },err=>{
      console.log(err)
      this.presentToast(err)
    })
  }

  //dismiss modal here
  dismiss(){
    this.modalController.dismiss({
    'dismissed': true
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
}

import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { ProviderService } from '../../providers/provider.service';
@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})

export class RatingPage implements OnInit {
@Input() id:string;
@Input() raty:any;
rating:any=[];
number:any;
res:any;
rater:any=[];
rates:any;

  constructor( public provider:ProviderService,public toastController: ToastController, public popoverController: PopoverController,) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    for (let index = 0; index <5; index++) {
      this.rating.push(index);
    }
    // console.log(this.rating)
    // this.rating.reverse();
    // console.log(this.rating)
    let rat=(Math.round((this.raty)/5));
    for (let index = 0; index<rat; index++) {
    this.rater.push(index);
    }
    this.rates={
    total:this.raty,
    rates:this.rater
    }
  }


  mark(i){
    this.number=i;
    //console.log(i)
  }

  submit(){
    //console.log(this.number)
    let number=this.number;
let body={
  number:(number+1)/10,
  seller_id:this.id
}
console.log(body)
    //add the rating

    this.provider.rate_shop(body).subscribe(res=>{
        this.popoverController.dismiss();
      this.res=res;
      if (this.res.message==="success") {
        this.presentToast('Thank you!');
      }
      else{
        this.presentToast(this.res.message);
      }
    },err=>{
      this.presentToast(err);
      console.log(err);
    })

  }

  async presentToast(params) {
      const toast = await this.toastController.create({
        message: params,
        duration: 2000
      });
      toast.present();
    }


}

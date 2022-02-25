import { Component, OnInit, Input } from '@angular/core';
import { ProviderService } from '../../providers/provider.service';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent, NavController, ToastController, AlertController, Platform, IonicSafeString } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { RatingPage } from '../../popover/rating/rating.page';
import { FootersPage } from '../../popover/footers/footers.page';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  @Input() type: string;
  //for users
  resp: any;
  data: boolean = false;
  empty: boolean;
  product_lists: any = []
  processing: boolean = false;
  confirm: boolean = false;
  cancel: boolean = false;
  isLoading: boolean;
  customer: boolean = false;
  res: any;
  resy: any;
  comments: boolean = false;
  add_comment: boolean = false;
  comment: any;
  comment_input: any = "";
  id: any;
  shipping_address: any;
  rating: any;
  rater: any = [];
  rates: any;
  rating_show: any;
  rate_no: any;

  constructor(public provider: ProviderService,
    public loadingController: LoadingController, public navy: NavController, public toastController: ToastController, public alertController: AlertController, public modalController: ModalController, public platform: Platform, public popoverController: PopoverController,) { }

  ngOnInit() {
  }



  ionViewWillEnter() {
    this.loader();
  }
  view(url) {
    window.open(url, '_blank').focus();
  }
  loader() {
    (this.type === "customer") ? this.customer = true : this.customer = false;
    let body = {
      session_id: localStorage.getItem('session_id'),
      type: (this.type === "customer") ? 'user' : 'seller'
    }

    this.provider.get_orders(body).subscribe(res => {
      this.resp = res;
      console.log(this.resp)

      if (this.resp.message === "success") {
        this.data = true;
        if (this.resp.data === "empty") {
          this.empty = true;
        }
        else {
          this.empty = false;
          this.product_lists = this.resp.data;
          //this.rat(this.resp.data[0].rating)
          //this.shipping_address=this.resp.address;
          //console.log(this.product_lists)
        }

      }
      else {
        this.data = true;
        this.presentToast(this.resp.message);
      }
    }, err => {
      this.data = true;
      this.presentToast(err);
      console.log(err);
    })
  }
  raty(inf) {
    this.rate_no = inf;
    this.rating_show = true;
    this.rat(inf);
  }

  rat(inf) {

    let rat = (Math.round((inf) / 5));
    this.rating = [];
    console.log(rat)
    for (let index = 0; index < 5; index++) {
      this.rating.push(index);
    }

    for (let index = 0; index < rat; index++) {
      this.rater.push(index);
    }
    this.rates = {
      total: this.rating,
      rates: this.rater
    }
  }



  //add rate
  async vote(id, ev, rating) {
    const popover = await this.popoverController.create({
      component: RatingPage,
      cssClass: 'bottom-sheet-popover',
      event: ev,
      translucent: true,
      showBackdrop: true,
      componentProps: {
        id: id,
        raty: rating
      }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();

  }

  //add rate
  async ships(id, ev) {
    const popover = await this.popoverController.create({
      component: FootersPage,
      cssClass: 'bottom-sheet-popover',
      event: ev,
      translucent: true,
      showBackdrop: true,
      componentProps: {
        id: id,
        type: 'shipping'
      }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();

  }


  adder() {
    this.add_comment = true;
  }

  //adding comments here
  add_comm(user, seller, id, sn) {
    let body = {
      customer_id: user,
      seller_id: seller,
      item_id: id,
      sn: sn,
      message: this.comment_input
    }
    this.provider.add_comm(body).subscribe(res => {
      this.res = res;
      if (this.res.message === "success") {
        this.add_comment = false;
        this.comment = this.res.comment;
        this.comments = true;
        this.comment_input = "";
        this.id = id;

      }
      else {
        this.presentToast(this.res.message);
        console.log(this.res.message)
      }
    }, err => {
      console.log(err);
      this.presentToast(err);
    })
  }

  //cancel  comments
  cancel_comment() {
    this.comment_input = "";
    this.add_comment = false;
  }

  hide_comm() {
    this.comments = false;
    this.id = "";
  }

  //feth comment here
  com(user, seller, id, sn) {
    let body = {
      seller_id: seller,
      item_id: id
    }

    this.provider.get_comm(body).subscribe(res => {
      this.res = res;
      if (this.res.message === "success") {
        this.add_comment = false;
        this.comment = this.res.comment;
        this.comments = true;
        this.comment_input = "";
        this.id = id;
      }
      else {
        this.presentToast(this.res.message);
        console.log(this.res.message)
      }
    }, err => {
      console.log(err);
      this.presentToast(err);
    })
  }

  //process order cancellation here
  async canceller(user, seller, item, sn, type) {
    console.log(type)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Action',
      message: '<strong>Are you sure you want to cancel this order, please note that this action is irreversible</strong>',
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'secondary',
          handler: () => {
            this.cancels(user, seller, item, sn, type);
          }
        }, {
          text: 'Cancel',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  cancels(user, seller, item, sn, type) {
    this.loadingPresent("Cancelling, please wait...");
    let body = {
      customer_id: user,
      seller_id: seller,
      item_id: item,
      sn: sn,
      type: type
    }
    //console.log(body)
    this.provider.cancel(body).subscribe(resp => {
      this.res = resp;
      if (this.res.message === "success") {
        this.loadingDismiss();

        //console.log(this.res.data)
        //this.product_lists=[];
        //this.product_lists=this.res.data;
        this.loader();
      }
      else {
        this.loadingDismiss();
        console.log(this.res.message);
        this.presentToast("Sorry, try again")
      }

    }, err => {
      this.loadingDismiss();
      console.log(err);
      this.presentToast(err);
    })
  }

  //accept and mark as processing here
  accept(user, seller, item, sn, type) {
    this.loadingPresent("Please wait...");
    let body = {
      customer_id: user,
      seller_id: seller,
      item_id: item,
      sn: sn,
      type: type
    }
    console.log(body)
    this.provider.accept(body).subscribe(resp => {
      this.res = resp;
      if (this.res.message === "success") {
        this.loadingDismiss();
        //console.log(this.res.data)
        this.product_lists = [];
        this.product_lists = this.res.data;
      }
      else {
        this.loadingDismiss();
        console.log(this.res.message);
        this.presentToast("Sorry, try again")
      }

    }, err => {
      this.loadingDismiss();
      console.log(err);
      this.presentToast(err);
    })
  }


  //dispute an item here
  async dispute(user, seller, item, sn) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Proceed to dispute',
      message: '<strong>We are sorry for any issues you might have experienced, kindly lodge your complaint here.</strong>',
      inputs: [
        {
          name: 'values',
          type: 'textarea',
          placeholder: 'Please type here',
        }
      ],
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'secondary',
          handler: (data) => {
            if (data.values === "" || data.values === null) {
              return false
            }
            else {
              this.disputer(user, seller, item, sn, data.values);
            }
          }
        }, {
          text: 'Cancel',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  async disputer(user, seller, item, sn, complaint) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Please confirm',
      message: '<strong>Are you sure you want to proceed?</strong>',
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'secondary',
          handler: () => {
            this.loadingPresent("Please wait...");
            let body = {
              session_id: localStorage.getItem('session_id'),
              item_id: item,
              seller_id: seller,
              complaint: complaint,
              sn: sn
            }
            this.provider.dispute(body).subscribe(res => {
              this.resy = res;
              if (this.resy.message === "success") {
                this.loadingDismiss();
                this.presentToast("Thank you, your complaint has been lodged and our admin will get back to you as soon as possible");
                this.dismiss();
              }
              else {
                this.loadingDismiss();
                console.log(this.resy.message);
                this.presentToast(this.resy.message);
              }
            }, err => {
              this.loadingDismiss();
              this.presentToast(err);
              console.log(err);
            })
          }
        }, {
          text: 'Cancel',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }


  async confirms(user, seller, item, sn, amount) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Action',
      message: '<strong>Are you sure you want to confirm delivery</strong>',
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'secondary',
          handler: () => {
            this.confirmed(user, seller, item, sn, amount);
          }
        }, {
          text: 'Cancel',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  confirmed(user, seller, item, sn, amount) {
    this.loadingPresent("Please wait...");
    let body = {
      customer_id: user,
      seller_id: seller,
      item_id: item,
      sn: sn
    }
    this.provider.confirm(body).subscribe(resp => {
      this.res = resp;
      if (this.res.message === "success") {
        this.loadingDismiss();
        console.log(this.res.data)
        this.product_lists = [];
        this.product_lists = this.res.data;

        this.pay_seller(amount, seller);
      }
      else {
        this.loadingDismiss();
        console.log(this.res.message);
        this.presentToast("Sorry, try again")
      }

    }, err => {
      this.loadingDismiss();
      console.log(err);
      this.presentToast(err);
    })
  }

  pay_seller(amount, seller) {
    this.loadingPresent("Please wait...");
    let body = {
      session_id: localStorage.getItem('session_id'),
      customer_id: seller,
      amount: amount,
      ref: `${Math.ceil(Math.random() * 10e10)}`,
      method: 'add_seller'
    }

    //add the money to the wallet and dismiss the previous modal
    this.provider.add_money(body).subscribe(res => {
      this.resp = res;
      if (this.resp.message === "success") {
        this.loadingDismiss();
      }
      else {
        this.loadingDismiss();
        this.presentToast(this.resp.message);
      }
    }, err => {
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

  //dismiss modal here
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


}

import { Component, ViewChild } from '@angular/core';
import { ProviderService } from '../providers/provider.service';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent, NavController, ToastController, AlertController, IonRouterOutlet, Platform, } from '@ionic/angular';
import { MenuController, IonImg } from '@ionic/angular';
import { SellerItemsPage } from '../modals/seller-items/seller-items.page';
import { OrdersPage } from '../modals/orders/orders.page';
import { EditPage } from '../modals/edit/edit.page';
import { WelcomePage } from '../guides/sellers/welcome/welcome.page'
import { Plugins } from '@capacitor/core';
// import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
const { App } = Plugins;
declare var ColorThief;
declare var Driver;
//declare var IntroJs;
declare var require: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild('imgs') imgs: IonImg;
  @ViewChild('content', { static: false }) content: IonContent;
  userImage: any;
  profileData: any;
  session_id: any;
  isLoading: boolean;
  firstname: any;
  lastname: any;
  email: any;
  phone: any;
  product_count: any;
  order_count: any;
  modal: any;
  balance_s: any;
  currency_s: any;
  res: any;
  balance: any;
  shop_name: any;
  caption: any;
  shop_details: any;
  shop_dp: any;
  color: any;
  reser: any;
  formData: any;
  images: any;
  resey: any;
  respo: any;
  token: any;
  resp: any;
  bank_details: any;
  fb: any = "";
  tw: any = "";
  rating: any;
  rater: any = [];
  rates: any;
  ig: any = "";
  checker: boolean;

  constructor(public provider: ProviderService,
    public loadingController: LoadingController, public navy: NavController, public toastController: ToastController, private menu: MenuController, public alertController: AlertController,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    public platform: Platform,
  ) {
    this.session_id = localStorage.getItem('session_id');
  }

  ionViewWillEnter() {
    //use this to test alert inoput
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        this.router('tabs/tab3');
      }
    });

    //if profile data is empty, return back to home page to login again
    (localStorage.getItem('userProfile') === null || localStorage.getItem('userProfile') === "") ? this.router('/tabs/tab1') : this.getData();
  }

  help() {
    (this.checker === true) ? localStorage.setItem('useGuide', 'off') : localStorage.setItem('useGuide', 'on');
  }
  async loadguide() {
    // import IntroJS
    const IntroJs = require("../../../node_modules/intro.js/intro");
    let intro = new IntroJs();
    console.log("inside intro.js");
    intro.setOptions({
      steps: [
        {
          intro: "<div><img src='../../../assets/images/guide-1.png' style='height:140px; width:95px;'><br><p style='text-align:center; padding:10px; '>Welcome to poncube shop!, click next to proceed or skip the guide</p><i style='color:green; font-size:10px; text-align:center;'>You can turn guides off by opening the side menu and swithing Guides off</i></div>"
        },
        {
          element: "#pro_1",
          intro:
            "To monitor, upload or edit your products, click on this buttton and wait till it fetches your data",
          position: "right"
        },
        {
          element: "#pro_2",
          intro:
            "To monitor or manage products that are purchased from your store, use this button",
          position: "bottom"
        }
      ],
      showProgress: false,
      skipLabel: "SKIP",
      doneLabel: "Done",
      nextLabel: "Next",
      prevLabel: "Previous",
      overlayOpacity: "0.5"
    });
    intro.start();

    this.content.scrollToBottom();
  }

  //upload image
  //change dp for users here
  async add_image($event) {
    let file = $event.target.files[0];
    const data = new FileReader();
    data.readAsDataURL(file);
    data.onload = (dataReader) => {
      this.formData = dataReader;

      let image_data = (this.formData.target.result.substr(0, 22) === "data:image/png;base64,") ? this.formData.target.result.replace("data:image/png;base64,", "") : this.formData.target.result.replace("data:image/jpeg;base64,", "");

      this.images = image_data;
      //this.image=this.formData.target.result;
      //this.imager=true;
    }
    //verify upload
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: '<strong>Upload image?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Proceed',
          handler: () => {
            let body = {
              session_id: localStorage.getItem('session_id'),
              image: this.images,
              type: 'seller'
            }
            this.provider.change_dp(body).subscribe(res => {
              this.reser = res;
              if (this.reser.message === "success") {
                this.getData();
              }
              else {
                this.presentToast(this.reser.message);
              }
            }, err => {
              this.presentToast(err)
            })
          }
        }
      ]
    });
    await alert.present();
  }

  //load_orders here
  async get_orders() {
    const modal = await this.modalController.create({
      component: OrdersPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'type': 'seller'
      }

    });

    await modal.present();

    //recheck the carts number upon modal dismissal
    //(await modal.onWillDismiss())his.cart_check():"";
  }


  //edit here
  async edit() {
    //open modal here instead of alert
    const modal = await this.modalController.create({
      component: EditPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'shop_name': this.shop_name,
        'caption': this.caption,
        'details': this.shop_details,
        'fb': this.fb,
        'tw': this.tw,
        'ig': this.ig,
        'type': 'seller'
      }

    });
    await modal.present();
    (await modal.onWillDismiss()) ? this.getData() : "";
  }


  //withdraw request here
  async withdraw() {
    //prompt alert to confirm transaction token
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm token',
      message: '<strong>Please enter your six digits transaction token sent to your email or text</strong>',
      inputs: [
        {
          name: 'option',
          type: 'number',
          placeholder: 'Transaction token'
        }],
      buttons: [
        {
          text: 'Confirm',
          cssClass: 'secondary',
          handler: (data) => {
            if (data.option === "") {
              this.presentToast("Please enter your token");
              return false;
            }
            else {

              //show product div
              this.loadingPresent("Please wait...");
              this.token = data.option;
              let session_id = localStorage.getItem('session_id');
              let body = {
                session_id: session_id
              }
              this.provider.get_token(body).subscribe(res => {
                this.resp = res;
                if (this.resp.token === this.token) {
                  this.loadingDismiss();
                  //initiate payment
                  this.withdraw_money();
                  return true;
                }
                else {
                  this.loadingDismiss();
                  this.presentToast("Wrong token, please try again");
                  return false;
                }
              })
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

  withdraw_money() {
    if (localStorage.getItem('account_details') === null) {
      this.presentToast('You do not have your account details, kindly add your account details here to proceed');
      this.add_account();
    }
    else {
      this.loadingPresent("Please wait while we process your transaction...");
      let details = JSON.parse(localStorage.getItem('account_details'));
      let body = {
        account_number: details.account_number,
        account_name: details.account_name,
        bank: details.bank,
        session_id: localStorage.getItem('session_id')
      }
      this.provider.withdraw_money(body).subscribe(res => {
        this.resey = res;

        if (this.resey.message === "success") {
          this.loadingDismiss();
          this.presentToast("Your withdraw request was successful and you will recieve your monney soon....");
          this.getData();
        }
        else {
          this.loadingDismiss();
          this.presentToast(this.resey.message);
          console.log(this.resey.message);
        }
      }, err => {
        this.loadingDismiss();
        this.presentToast("Sorry, an error occured");
        console.log(err);
      })

    }
  }

  async add_account() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Update your account details',
      inputs: [
        {
          name: 'account_name',
          type: 'text',
          placeholder: 'Account name'
        },
        {
          name: 'account_number',
          type: 'number',
          placeholder: 'Account number'
        },
        {
          name: 'bank',
          type: 'text',
          placeholder: 'Bank'
        }
      ],
      buttons: [
        {
          text: 'Save',
          cssClass: 'secondary',
          handler: (data) => {
            if (data.account_name === "" || data.account_number === "" || data.bank === "") {
              this.presentToast("No, parameter must be empty");
              return false;
            }
            else {
              //show product div
              this.loadingPresent("Please wait...");
              let session_id = localStorage.getItem('session_id');
              let body = {
                session_id: session_id,
                account_name: data.account_name,
                account_number: data.account_number,
                bank: data.bank
              }
              this.provider.save_bank(body).subscribe(res => {
                this.respo = res;
                if (this.respo.message === "success") {
                  this.loadingDismiss();
                  this.presentToast('Bank datas saved successfully');
                  this.getData();
                }
                else {
                  this.loadingDismiss();
                  this.presentToast(this.respo.message);
                  console.log(this.respo.message)
                  return false;
                }
              }, err => {
                this.loadingDismiss();
                this.presentToast("sorry, there was an error...");
                console.log(err);
              })
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

  //check balance here
  getData() {
    this.loadingPresent('Hold on, fetching data...');
    let body = {
      session_id: localStorage.getItem('session_id')
    }
    this.provider.get_seller(body).subscribe(res => {
      this.res = res;
      //console.log(res)
      if (this.res.message === "success") {


        localStorage.setItem('balance', this.res.balance);

        this.shop_name = this.res.details[0].shop_name;
        this.caption = this.res.details[0].caption;
        this.shop_details = this.res.details[0].shop_details;
        this.shop_dp = this.res.details[0].shop_dp;
        this.fb = this.res.details[0].fb;
        this.ig = this.res.details[0].ig;
        this.tw = this.res.details[0].tw;
        let rat = (Math.round((this.res.details[0].rating) / 5));
        this.rating = [];
        //console.log(rat)
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
        //console.log(this.rating);
        this.product_count = this.res.item_count;
        this.order_count = this.res.data;
        this.balance = this.res.balance;
        //save bank details here
        if (this.res.bank_details === "empty") {

        }
        else {
          this.bank_details = {
            account_name: this.res.bank_details[0].account_name,
            account_number: this.res.bank_details[0].account_number,
            bank: this.res.bank_details[0].bank
          }
          localStorage.setItem('account_details', JSON.stringify(this.bank_details));
        }


        this.loadingDismiss();
        this.loadData();
        // var parent = this;
        //
        // const colorThief = new ColorThief();
        // const img = new Image();
        //
        // img.addEventListener('load', function() {
        //
        //   //convert here
        //   const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        //     const hex = x.toString(16)
        //     return hex.length === 1 ? '0' + hex : hex
        //   }).join('');
        //
        //   //assign to variable
        //   parent.color = rgbToHex(colorThief.getColor(img)[0], colorThief.getColor(img)[1], colorThief.getColor(img)[2]);
        //
        //
        //   console.log(rgbToHex(colorThief.getColor(img)[0], colorThief.getColor(img)[1], colorThief.getColor(img)[2]));
        // }
        // );
        // let imageURL = this.imgs.src;
        // let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
        // img.crossOrigin = 'Anonymous';
        // img.src = imageURL;
        //console.log(colorThief.getColor(this.imgs.src));
        //console.log(this.imgs.src)


      }
      else {
        //means there is session id, route to login and open login modal
        console.log(res)
        this.loadingDismiss();
      }
    }, err => {
      this.loadingDismiss();
      this.presentToast('Sorry, an error occured');
      console.log(err);
    })
  }

  //load modal here to check product
  async products() {
    this.modal = await this.modalController.create({
      component: SellerItemsPage,
      cssClass: 'my-custom-class',
      componentProps: {
      }

    });

    await this.modal.present();

    //recheck the carts number upon modal dismissal
    await this.modal.onWillDismiss()
  }


  //control side menu here
  openFirst() {
    this.menu.enable(true, 'sell_menu');
    this.menu.open('sell_menu');
  }

  openEnd() {
    this.menu.open('end');
  }


  //load  the data  here
  loadData() {
    this.profileData = JSON.parse(localStorage.getItem('userProfile'));
    this.firstname = this.profileData.firstname;
    this.lastname = this.profileData.lastname;
    this.email = this.profileData.email;
    this.phone = this.profileData.phone;
    this.userImage = (this.profileData.dp === "" || this.profileData.dp === null) ? "assets/images/user.png" : this.profileData.dp;
    //check if user has turned guide on or off, dont forget to keep the settins even when logged off
    if (localStorage.getItem('useGuide') === "off" || localStorage.getItem('useGuide') === null) {
      this.loadguide();
      this.checker = true;
    }
    else {

    }
  }



  //router here
  router(param) {
    this.navy.navigateBack(param);
  }


  //loading controller here
  async loadingPresent(params) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: params,
      spinner: 'circles'
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


}

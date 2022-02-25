import { Component, ViewChild } from '@angular/core';
import { ProviderService } from '../providers/provider.service';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent, NavController, ToastController, AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AddMoneyPage } from '../modals/add-money/add-money.page';
import { ProductPage } from '../modals/product/product.page';
import { OrdersPage } from '../modals/orders/orders.page';
import { SubcategoryPage } from '../popover/subcategory/subcategory.page';
import { FootersPage } from '../popover/footers/footers.page';
import { PopoverController, IonSlides } from '@ionic/angular';
import { RegisterPage } from '../modals/register/register.page';
import { TransactionsPage } from '../modals/transactions/transactions.page';
import { NavigationExtras } from '@angular/router';
import { EditPage } from '../modals/edit/edit.page';
import { FootpagePage } from '../footpage/footpage.page';
import { Title } from '@angular/platform-browser';
import { DatasService } from '../datas/datas.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { Plugins } from '@capacitor/core';
// import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
const { App } = Plugins;

declare var FB;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('slides') slides: IonSlides;
  @ViewChild('slider') slider: IonSlides;

  userImage: any;
  profileData: any;
  session_id: any;
  isLoading: boolean;
  firstname: any;
  lastname: any;
  email: any;
  phone: any;
  resp: any;
  balance: any;
  //currency:any;
  res: any;
  seller: boolean;
  pending: boolean;
  nonseller: boolean;
  list: any;
  counts: any;
  count: any;
  sub_category: any;
  sub_sub_category: any;
  store: any;
  dat: any;
  categories: any;
  datas: any;
  modal: any;
  images: any;
  formData: any;
  reser: any;
  wallet_id: any;
  res_tr: any;
  res_c: any;
  currency: any = "NGN";
  rates: any;
  rate_value: any = 1;
  address: any;
  res_ed: any;
  res_tk: any;
  l_res: any;
  l_ress: any;


  constructor(public provider: ProviderService,
    public loadingController: LoadingController, public navy: NavController, public toastController: ToastController, private menu: MenuController, public alertController: AlertController, public modalController: ModalController, public popoverController: PopoverController, private titleService: Title, private da: DatasService, private authService: SocialAuthService, private routerOutlet: IonRouterOutlet,
    public platform: Platform,) {
    this.provider.categoriesAll().subscribe(resp => {
      this.dat = resp;
      this.categories = this.dat.category;
      this.sub_category = this.dat.sub_category;
      this.sub_sub_category = this.dat.sub_sub_category;
      this.store = this.dat.store;

      window['fbAsyncInit'] = function() {
        FB.init({
          appId: '607287937251999',
          cookie: true,
          xfbml: true,
          version: 'v12.0'
        });

        FB.AppEvents.logPageView();

      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
      //console.log(this.dat);
      //this.loadingDismiss();
      //this.load();
    })
  }

  ionViewWillEnter() {
    this.rate_check();
    // this.rate_value = 1;
    // localStorage.setItem('currency', "NGN");

    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        this.navy.navigateBack('/tabs/tab1');
      }
    });

    this.session_id = localStorage.getItem('session_id');
    // (localStorage.getItem('userProfile')===null || localStorage.getItem('userProfile')==="")?this.getData(this.session_id):this.loadData();

    this.getData(this.session_id);
    this.cart_check();
  }

  rate_check() {
    this.currency = (localStorage.getItem('currency') === null || localStorage.getItem('currency') === undefined || localStorage.getItem('currency') === "") ? "NGN" : localStorage.getItem('currency');
    if (localStorage.getItem('rates') === "" || localStorage.getItem('rates') === undefined || localStorage.getItem('rates') === null) {
      //  this.exchange();
      // this.rates=JSON.parse(localStorage.getItem('rates'));
      // this.rate_value=this.rates[this.currency];
      // console.log(this.rate_value);
    }
    else {
      this.rates = JSON.parse(localStorage.getItem('rates'));
      this.rate_value = this.rates.rates[this.currency];
      //  console.log(this.rate_value);
    }
  }

  change_rate() {
    if (localStorage.getItem('rates') === "" || localStorage.getItem('rates') === undefined || localStorage.getItem('rates') === null) {
      //   this.exchange();
      //   this.rates=JSON.parse(localStorage.getItem('rates'));
      //   this.rate_value=this.rates[this.currency];
      // //  console.log(this.rate_value);
      // localStorage.setItem('currency',this.currency);
    }
    else {
      this.rates = JSON.parse(localStorage.getItem('rates'));
      this.rate_value = this.rates.rates[this.currency];
      //console.log(this.rate_value);
      localStorage.setItem('currency', this.currency);
    }
  }



  //cart_checker function here
  cart_check() {
    //get saved cart items
    this.list = (localStorage.getItem('carts') === null) ? [] : JSON.parse(localStorage.getItem('carts'));
    //console.log(this.list);
    this.counts = this.list.length;
  }

  async sub(id, ev: any, name) {
    //get the needed category
    const suber = this.sub_category.filter(res => res.parent_id === id);


    const popover = await this.popoverController.create({
      component: SubcategoryPage,
      cssClass: 'pop-class',
      event: ev,
      translucent: true,
      showBackdrop: true,
      componentProps: {
        'sub_category': suber,
        'sub_sub_category': this.sub_sub_category,
        'view': name
      }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    //console.log('onDidDismiss resolved with role', role);
  }

  //show footers for mobile here
  async footie(param, ev) {
    const popover = await this.popoverController.create({
      component: FootersPage,
      cssClass: 'custom-class',
      event: ev,
      translucent: true,
      showBackdrop: true,
      componentProps: {
        'type': param
      }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }


  async load_cart() {
    const modal = await this.modalController.create({
      component: ProductPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'type': 'carts'
      }

    });

    await modal.present();

    //recheck the carts number upon modal dismissal
    (await modal.onWillDismiss()) ? this.cart_check() : "";
  }

  async history() {
    const modal = await this.modalController.create({
      component: TransactionsPage,
      cssClass: 'my-custom-class',
      componentProps: {
      }

    });

    await modal.present();
  }


  //control side menu here
  openFirst(param) {
    this.menu.enable(true, param);
    this.menu.open(param);
  }

  openEnd() {
    this.menu.open('end');
  }

  //confrim that user wants to turn to seller
  async confirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: '<strong>Are you sure you want to Become a seller on poncube?</strong>',
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
            this.sell();
          }
        }
      ]
    });

    await alert.present();
  }

  //next and previus
  prev() {
    this.slides.slidePrev();
    this.slider.slidePrev();
  }
  next() {
    this.slides.slideNext();
    this.slider.slideNext();
  }

  //handle fund transfer here
  async transfer() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Send money from your wallet',
      message: '<i> Note that all outbound wallet transfers are in NGN </i>',
      inputs: [
        {
          name: 'wallet_id',
          type: 'text',
          placeholder: 'Destination wallet id'
        },
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Amount'
        },
        {
          name: 'token',
          type: 'number',
          placeholder: 'Your transaction token'
        },
      ],
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
          handler: (data) => {
            if (data.wallet_id === "" || data.amount === "" || data.token === "") {
              this.presentToast("Please fill all fields");
              return false;
            }
            else {
              this.loadingPresent("Verifying, please wait...");
              let body = {
                session_id: this.session_id,
                wallet_id: data.wallet_id,
                amount: data.amount,
                token: data.token
              }
              this.provider.transfer(body).subscribe(res => {
                this.res_tr = res;

                if (this.res_tr.message === "success") {
                  this.loadingDismiss();
                  //confirm returned user datas
                  this.confirm_transfer(this.res_tr.fullname, this.res_tr.mail, data.amount, data.wallet_id);
                  return true;
                }
                else {
                  this.loadingDismiss();
                  console.log(this.res_tr.message);
                  this.presentToast(this.res_tr.message);
                }
              }, err => {
                this.loadingDismiss();
                console.log(err);
                this.presentToast(err);
              })
            }
          }
        }
      ]
    });

    await alert.present();
  }


  async confirm_transfer(fullname, mail, amount, wallet_id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm the reciever',
      message: '<div>Send ' + amount + ' to ' + fullname + '</div>',
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
            this.loadingPresent("Sending, please wait...");
            let body = {
              session_id: this.session_id,
              amount: amount,
              wallet_id: wallet_id
            }
            this.provider.send_money(body).subscribe(res => {
              this.res_c = res;
              if (this.res_c.message === "success") {
                this.loadingDismiss();
                this.presentToast("transaction successfull");
                //fetch profile data aain;
                this.getData(this.session_id);
              }
              else {
                this.loadingDismiss();
                this.presentToast(this.res_c.message);
                console.log(this.res_c.message)
              }
            }, err => {
              this.loadingDismiss();
              this.presentToast(err);
              console.log(err)
            });
          }
        }
      ]
    });

    await alert.present();
  }


  //edit name and phone number here
  async edit_profile() {
    //open modal here instead of alert
    const modal = await this.modalController.create({
      component: EditPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'firstname': this.firstname,
        'lastname': this.lastname,
        'address': this.address,
        'email': this.email,
        'phone': this.phone,
        'type': 'customer'
      }

    });

    await modal.present();
    (await modal.onWillDismiss()) ? this.getData(localStorage.getItem('session_id')) : "";

  }

  async change_token() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Change transaction token',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Enter your current login password'
        }
      ],

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
          handler: (data) => {
            if (data.password === "" || data.email === "") {
              this.presentToast("Kindy enter your login password");
              return false;
            }
            else {
              this.loadingPresent("Please wait...");
              let body = {
                session_id: this.session_id,
                password: data.password
              }
              this.provider.change_token(body).subscribe(res => {
                this.res_tk = res;
                if (this.res_tk.message === "success") {
                  this.loadingDismiss();
                  this.presentToast("You have successfully generated a new token for your transactions, kindly check your mail for your new token");
                  //fetch profile data aain;
                  this.getData(this.session_id);
                }
                else {
                  this.loadingDismiss();
                  this.presentToast(this.res_tk.message);
                  console.log(this.res_tk.message)
                }
              }, err => {
                this.loadingDismiss();
                this.presentToast(err);
                console.log(err)
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }



  //convert user to a seller here
  //allow user become a seller here
  async sell() {
    this.modal = await this.modalController.create({
      component: RegisterPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'type': "s_register",
      }
    });
    await this.modal.present();
    (await this.modal.onWillDismiss()) ? this.getData(localStorage.getItem('session_id')) : "";
  }

  route(param) {
    this.navy.navigateRoot(param);
  }

  async get_orders() {
    const modal = await this.modalController.create({
      component: OrdersPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'type': 'customer'
      }

    });

    await modal.present();

    //recheck the carts number upon modal dismissal
    //(await modal.onWillDismiss())his.cart_check():"";
  }

  //fetch user informations here
  getData(session_id) {
    this.loadingPresent('Hold on, fetching data...');
    this.provider.get_profile(session_id).subscribe(res => {
      this.resp = res;
      if (this.resp.message === "Success") {
        localStorage.setItem('balance', this.resp.balance);
        this.wallet_id = this.resp.wallet_id;
        // console.log(res)
        localStorage.setItem('userProfile', JSON.stringify(res));
        this.loadingDismiss();
        this.loadData();
        localStorage.setItem('log', 'true');

      }
      else {
        //means there is session id, route to login and open login modal
        this.prompter();
      }
    }, err => {
      this.loadingDismiss();
      this.presentToast('Sorry, an error occured');
      console.log(err);
    })
  }


  async prompter() {
    const create = await this.alertController.create({
      header: "Error",
      message: "Your account has been logged in on another device, kindly login again"
    })
    await create.present();
    this.loadingDismiss();
    //clear the user data
    const guide_1 = localStorage.getItem('useGuide');
    const guide_2 = localStorage.getItem('show_guide_user');

    localStorage.clear();
    localStorage.setItem('useGuide', guide_1);
    localStorage.setItem('show_guide_user', 'off')

    this.navy.navigateRoot('/tabs/tab1');
  }
  loadData() {
    this.profileData = JSON.parse(localStorage.getItem('userProfile'));
    this.firstname = this.profileData.firstname;
    this.lastname = this.profileData.lastname;
    this.email = this.profileData.email;
    this.phone = this.profileData.phone;
    this.userImage = (this.profileData.dp === "" || this.profileData.dp === null) ? "assets/images/user.png" : this.profileData.dp;
    this.address = this.profileData.address;
    //this.currency=this.profileData.currency;
    this.titleService.setTitle('PONCUBE | ' + this.firstname + ' ' + this.lastname);
    // this.seller=(this.profileData.isSeller==="" || this.profileData===null)?false:true;

    if (this.profileData.isSeller == "") {
      this.nonseller = true;
      this.seller = false;
      this.pending = false;
    }
    else if (this.profileData.isSeller == "1") {
      this.seller = true;
      this.nonseller = false;
      this.pending = false;
    }
    else if (this.profileData.isSeller == "2") {
      this.pending = true;
      this.seller = false;
      this.nonseller = false;
    }
    this.loggin_check();
    this.getBalance();
    this.count = this.profileData.count;
    this.datas = (this.profileData.datas == null) ? "" : this.profileData.datas.reverse();

  }

  getBalance() {
    this.balance = localStorage.getItem('balance');

  }
  loggin_check() {
    let body = {
      session_id: this.session_id
    }
    this.provider.loggin_check(body).subscribe(res => {
      this.l_res = res;
      //console.log(res)
      if (this.l_res.message === "logged") {
        //do nothing
        this.c_log();
      }
      else if (this.l_res.message === "wait") {
        this.loggin_prompt()
      }
      else if (this.l_res.message === "Invalid User") {
        this.presentToast('Your account has been logged off');
        if (localStorage.getItem('log') === 'true') {
          this.logout();
        }
        else {

        }
      }
    }, err => {
      console.log(err)
    });
  }

  c_log() {
    setTimeout(() => {
      this.loggin_check();
    }, 3000);
  }

  async loggin_prompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Security notification',
      message: '<strong>Your account is about to be logged in on another device, kindly decline to prevent this or cancel to allow... this will be permitted in few seconds if no response is made</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel: blah');
            this.c_log();
          }
        }, {
          text: 'Decline',
          handler: () => {
            let body = {
              session_id: this.session_id
            }
            //decline here
            this.provider.cancel_log(body).subscribe(res => {
              this.l_ress = res;
              if (this.l_ress.message === "success") {
                this.presentToast('Declined');
                this.c_log();
              }
              else {
                this.presentToast(this.l_ress.message);
                console.log(this.l_ress.message);
              }
            }, err => {
              this.presentToast(err);
              console.log(err);
            });
          }
        }
      ]
    });

    await alert.present();

    setTimeout(() => {
      alert.dismiss();
      this.c_log();
    }, 6000);
  }

  //logout here
  logout() {
    //  console.log(localStorage.getItem('login_type'))
    const guide_1 = localStorage.getItem('useGuide');
    const guide_2 = localStorage.getItem('show_guide_user');

    if (localStorage.getItem('login_type') === 'normal') {
      localStorage.setItem('log', 'false');
      this.loadingPresent('Logging you out..');
      let session_id = localStorage.getItem('session_id');
      this.provider.logout(session_id).subscribe(res => {
        localStorage.clear();
        localStorage.setItem('useGuide', guide_1);
        localStorage.setItem('show_guide_user', 'off')
        this.loadingDismiss();
        this.navy.navigateRoot('/tabs/tab1');
      });
    }
    else if (localStorage.getItem('login_type') === 'facebook') {
      FB.logout(function(response) {
      });
      //proceed to logout the normal way
      localStorage.setItem('log', 'false');
      this.loadingPresent('Logging you out..');
      let session_id = localStorage.getItem('session_id');
      this.provider.logout(session_id).subscribe(res => {
        localStorage.clear();
        localStorage.setItem('useGuide', guide_1);
        localStorage.setItem('show_guide_user', 'off')
        this.loadingDismiss();
        this.navy.navigateRoot('/tabs/tab1');
      });
    }
    else if (localStorage.getItem('login_type') === 'google') {
      this.authService.signOut();


      localStorage.setItem('log', 'false');
      this.loadingPresent('Logging you out..');
      let session_id = localStorage.getItem('session_id');
      this.provider.logout(session_id).subscribe(res => {
        localStorage.clear();
        localStorage.setItem('useGuide', guide_1);
        localStorage.setItem('show_guide_user', 'off')
        this.loadingDismiss();
        this.navy.navigateRoot('/tabs/tab1');
      });
    }

  }

  //control sliders here for mobile
  slideOptsMobile = {
    initialSlide: 1,
    slidesPerView: 2,
    loop: false,
    centeredSlides: true,
    spaceBetween: 1
  };

  //control slider for browser here
  slideOptsBrowser = {
    initialSlide: 1,
    slidesPerView: 3,
    loop: false,
    centeredSlides: true,
    spaceBetween: 1
  };

  //load product modal there//check out on specific product here
  async product(id, shop_id, type) {
    // console.log(type)
    // const modal = await this.modalController.create({
    //   component: ProductPage,
    //   cssClass: "custom",
    //   componentProps: {
    //     'id': id,
    //     'shop_id': shop_id,
    //     'type': type
    //   }
    // });
    // await modal.present();
    // //recheck the carts number upon modal dismissal
    // (await modal.onWillDismiss()) ? this.cart_check() : "";

    let options: NavigationExtras = {
      queryParams: {
        type: type,
        id: id,
        shop_id: shop_id
      }
    }
    this.navy.navigateForward(['product-view'], options);
  }

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
              type: 'user'
            }
            this.provider.change_dp(body).subscribe(res => {
              this.reser = res;
              if (this.reser.message === "success") {
                this.getData(localStorage.getItem('session_id'));
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

  //add money
  async load_pay() {
    const modal = await this.modalController.create({
      component: AddMoneyPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'usermail': this.email,
        'userphone': this.phone,
        'username': this.firstname + ' ' + this.lastname
      }
    });
    //wait for the shut down of modal and fetch the new balance
    await modal.present();
    (await modal.onWillDismiss()) ? this.getBalance() : "";
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
      duration: 4000
    });
    toast.present();
  }


  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }
}

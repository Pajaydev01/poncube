import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderService } from '../providers/provider.service';
import { DatasService } from '../datas/datas.service';
import { SubcategoryPage } from '../popover/subcategory/subcategory.page';
import { FootersPage } from '../popover/footers/footers.page';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent, NavController, Platform, ToastController, IonRouterOutlet, } from '@ionic/angular';
import { ProductPage } from '../modals/product/product.page';
import { RegisterPage } from '../modals/register/register.page';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { MenuController, IonSlides } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { FootpagePage } from '../footpage/footpage.page';
import { Title } from '@angular/platform-browser';
import { Plugins } from '@capacitor/core';
// import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
const { App } = Plugins;
@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('slides') slides: IonSlides;
  @ViewChild('slider') slider: IonSlides;
  //@ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild(IonContent) content: IonContent;

  data: boolean = false;
  dat: any;
  counter: any;
  counter_2: any;
  categories: any;
  products: any = [];
  isLoading: boolean;
  results: any = [];
  total: any;
  list: any;
  counts: any;
  modal: any;
  logged: boolean;
  search: any = "";
  itemer: any = [];
  new_s: any = [];
  resp: any;
  platform_class: any;
  sub_category: any;
  sub_sub_category: any;
  store: any;
  favorite: any;
  dp: any;
  counting: any = 1;
  shop_id: any;
  shop_name: any;
  shop_image: any;
  shop_details: any;
  fullname: any;
  scrolled: boolean = true;
  currency: any = "NGN";
  rates: any;
  rate_value: any = 1;
  e_res: any;
  fb: any = "";
  ig: any = "";
  tw: any = "";
  rating: any;
  rater: any = [];
  raty: any;

  constructor(
    public provider: ProviderService,
    public loadingController: LoadingController,
    public modalController: ModalController,
    private routee: ActivatedRoute,
    private router: Router,
    private datas: DatasService,
    public navy: NavController,
    public platform: Platform,
    public popoverController: PopoverController,
    private menu: MenuController,
    private route: ActivatedRoute,
    private titleService: Title,
    public toastController: ToastController,
    private routerOutlet: IonRouterOutlet,
  ) {
    //first get all the categories
    //  this.loadingPresent('Loading, please wait');
    this.provider.categoriesAll().subscribe(resp => {
      this.dat = resp;
      this.categories = this.dat.category;
      this.sub_category = this.dat.sub_category;
      this.sub_sub_category = this.dat.sub_sub_category;
      this.store = this.dat.store;

      //console.log(this.dat);
      //this.loadingDismiss();
      this.load();
    })


    this.route.queryParams.subscribe(params => {
      this.shop_id = params["shop_id"]
    });
  }

  ngOnInit() {
  }

  exchange() {
    this.provider.get_exchange().subscribe(res => {
      this.e_res = res;
      if (this.e_res.message === "success") {
        //  console.log(this.e_res.exchange.rates)
        localStorage.setItem('rates', JSON.stringify(this.e_res.exchange));
        this.rates = JSON.parse(localStorage.getItem('rates'));
        this.rate_value = this.rates.rates[this.currency];
      }
      else {
        this.presentToast('error occured while fetching exchange rates');
      }
    }, err => {
      console.log(err);
      this.presentToast(err);
    })
  }

  change_rate() {
    if (localStorage.getItem('rates') === "" || localStorage.getItem('rates') === undefined || localStorage.getItem('rates') === null) {
      this.exchange();

      //  console.log(this.rate_value);
      localStorage.setItem('currency', this.currency);
    }
    else {
      this.rates = JSON.parse(localStorage.getItem('rates'));
      this.rate_value = this.rates.rates[this.currency];
      //console.log(this.rate_value);
      localStorage.setItem('currency', this.currency);
    }
  }

  rate_check() {
    this.currency = (localStorage.getItem('currency') === null || localStorage.getItem('currency') === undefined || localStorage.getItem('currency') === "") ? "NGN" : localStorage.getItem('currency');
    if (localStorage.getItem('rates') === "" || localStorage.getItem('rates') === undefined || localStorage.getItem('rates') === null) {
      this.exchange();
      this.rates = JSON.parse(localStorage.getItem('rates'));
      this.rate_value = this.rates[this.currency];
      console.log(this.rate_value);
    }
    else {
      this.rates = JSON.parse(localStorage.getItem('rates'));
      this.rate_value = this.rates.rates[this.currency];
      //  console.log(this.rate_value);
    }
  }




  onScroll(ev) {
    //console.log(ev);
    if (ev.detail.scrollTop >= 130) {
      //  alert('hi');
      this.scrolled = false;
    }
    else {
      this.scrolled = true;
    }
  }

  ionViewWillEnter() {

    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        this.navy.navigateBack('/tabs/tab1');
      }
    });
    //change modal class here
    this.platform_class = this.platform.is('desktop') || this.platform.is('tablet') ? "product-modal" : "my-custom-modal";
    //
    // console.log(localStorage.getItem('userProfile'));
    this.check_profile();

    this.rate_check();
    // this.rate_value = 1;
    // localStorage.setItem('currency', "NGN");
    //automate the next and previou
  }

  check_profile() {
    //console.log(this.platform_class)
    this.logged = (localStorage.getItem('userProfile') === null || localStorage.getItem('userProfile') === "") ? true : false;
    this.cart_check();

    if (localStorage.getItem('userProfile') !== null) {
      let data = JSON.parse(localStorage.getItem('userProfile'));
      this.dp = data.dp;
      this.fullname = data.firstname + " " + data.lastname;
      //console.log(this.dp);
    }
  }

  //control side menu here
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  //load sub category here
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
  //dismiss pop over

  async opdismiss() {
    await this.popoverController.dismiss();
  }
  dismiss() {
    alert('hi')
  }

  searchs() {
    this.new_s = [];
    this.resp.data_1.find(res => {
      if (res.name.toLowerCase().includes(this.search.toLowerCase())) {
        this.new_s.push(res);
        //this.products;
      }
      this.products = this.new_s
    })
  }

  //cart_checker function here
  cart_check() {
    //get saved cart items
    this.list = (localStorage.getItem('carts') === null) ? [] : JSON.parse(localStorage.getItem('carts'));
    //console.log(this.list);
    this.counts = this.list.length;
  }


  //scroll item
  scroll(event) {
    //console.log(event)
    this.content.scrollToBottom(3000);
  }

  //load item list
  load() {
    let body = {
      shop_id: this.shop_id
    }

    let count = this.categories.length;
    this.provider.get_seller_products(body).subscribe(resp => {
      //store to local storage
      this.resp = resp;
      localStorage.setItem('total', JSON.stringify(this.resp.data_1));
      //console.log(this.resp)
      this.shop_name = this.resp.data_2.shop_name;
      this.shop_details = this.resp.data_2.shop_details;
      this.shop_image = this.resp.data_2.shop_dp.replace(" ", "%20");
      this.fb = (this.resp.data_2.fb.includes("https://") || this.resp.data_2.fb.includes("http://")) ? this.resp.data_2.fb : 'https://' + this.resp.data_2.fb;
      this.ig = (this.resp.data_2.ig.includes("https://") || this.resp.data_2.ig.includes("http://")) ? this.resp.data_2.ig : 'https://' + this.resp.data_2.ig;
      this.tw = (this.resp.data_2.tw.includes("https://") || this.resp.data_2.tw.includes("http://")) ? this.resp.data_2.tw : 'https://' + this.resp.data_2.tw;
      //Rating
      let rat = (Math.round((this.resp.data_2.rating) / 5));
      this.rating = [];
      for (let index = 0; index < 5; index++) {
        this.rating.push(index);
      }

      for (let index = 0; index < rat; index++) {
        this.rater.push(index);
      }
      this.raty = {
        total: this.rating,
        rates: this.rater
      }
      this.products = (this.resp.data_1 !== undefined) ? this.resp.data_1 : undefined;

      //  console.log(this.products.length);
      this.itemer = this.resp.data_1;
      this.data = true;
      this.titleService.setTitle('PONCUBE | ' + this.shop_name);
      //this.roll();

    })

  }


  //check out on specific product here
  async product(id, shop_id, type) {
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

  async load_cart() {
    this.modal = await this.modalController.create({
      component: ProductPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'type': 'carts'
      }

    });

    await this.modal.present();

    //recheck the carts number upon modal dismissal
    (await this.modal.onWillDismiss()) ? this.cart_check() : "";
  }

  //load the registration modal here
  async reg(type) {
    const modal = await this.modalController.create({
      component: RegisterPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'type': type,
      }
    });
    return await modal.present();
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
  //show menu
  async meni(param, ev, dp, name) {
    const popover = await this.popoverController.create({
      component: FootersPage,
      cssClass: 'custom-class',
      event: ev,
      translucent: true,
      showBackdrop: true,
      componentProps: {
        'type': param,
        'dp': dp,
        'name': name
      }
    });

    await popover.present();
    await popover.onDidDismiss().then(res => {
      this.check_profile();
    });

  }

  logout() {
    this.loadingPresent('Logging you out..');
    let session_id = localStorage.getItem('session_id');
    this.provider.logout(session_id).subscribe(res => {
      localStorage.clear();
      this.logged = true;
      this.loadingDismiss();
    });
  }

  go(param) {
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

  openInNewTab(url) {
    if (url === "") {
      this.presentToast("Not available");
    }
    else {
      window.open(url, '_blank').focus();
    }
  }

  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }

  async presentToast(params) {
    const toast = await this.toastController.create({
      message: params,
      duration: 2000
    });
    toast.present();
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderService } from '../providers/provider.service';
import { DatasService } from '../datas/datas.service';
import { SubcategoryPage } from '../popover/subcategory/subcategory.page';
import { FootersPage } from '../popover/footers/footers.page';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent, NavController, Platform, ToastController, AlertController, IonRouterOutlet } from '@ionic/angular';
import { ProductPage } from '../modals/product/product.page';
import { RegisterPage } from '../modals/register/register.page';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { MenuController, IonSlides } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { FootpagePage } from '../footpage/footpage.page';
import { Title } from '@angular/platform-browser';
import { WelcomePage } from '../guides/sellers/welcome/welcome.page';
import { Plugins } from '@capacitor/core';
// import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
const { App } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('slides') slides: IonSlides;
  @ViewChild('slider') slider: IonSlides;
  @ViewChild('sfilter') sfilter;
  //@ViewChild(IonContent, {static: false}) content: IonContent;
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
  fullname: any;
  scrolled: boolean = true;
  e_res: any;
  currency: any = "NGN";
  rates: any;
  rate_value: any = 1;
  sFilter: any = 'Search poncube';
  filterValue: any;
  searchParam: any;
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
    private titleService: Title,
    public toastController: ToastController,
    public alertController: AlertController,
    private routerOutlet: IonRouterOutlet,
  ) {

    //first get all the categories
    //  this.loadingPresent('Loading, please wait')
    this.start();
  }

  start() {
    this.provider.categoriesAll().subscribe(resp => {
      this.dat = resp;
      this.categories = this.dat.category;
      this.sub_category = this.dat.sub_category;
      this.sub_sub_category = this.dat.sub_sub_category;
      this.store = this.dat.store;

      //  console.log(this.store);
      //this.loadingDismiss();
      this.load();
    })
  }
  //for refresh
  starter(event) {
    this.provider.categoriesAll().subscribe(resp => {
      this.dat = resp;
      this.categories = this.dat.category;
      this.sub_category = this.dat.sub_category;
      this.sub_sub_category = this.dat.sub_sub_category;
      this.store = this.dat.store;
      this.load();
    })
    event.target.complete();
  }

  ngOnInit() {
    //tr and get the exchange rate here
    //  this.exchange();
  }

  exchange() {
    this.provider.get_exchange().subscribe(res => {
      this.e_res = res;

      if (this.e_res.message === "success") {
        localStorage.setItem('rates', JSON.stringify(this.e_res.exchange));
        this.rates = JSON.parse(localStorage.getItem('rates'));
        this.rate_value = this.rates.rates[this.currency];
        console.log(this.rates)
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

  ionViewWillEnter() {
    // this.rate_value = 1;
    // localStorage.setItem('currency', "NGN");
    //use this to test alert inoput
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });

    this.titleService.setTitle('PONCUBE | Home');
    //change modal class here
    this.platform_class = this.platform.is('desktop') || this.platform.is('tablet') ? "product-modal" : "my-custom-modal";
    this.check_profile();
    this.rate_check();

    //console.log(localStorage.getItem('show_guide_user'));
    (localStorage.getItem('show_guide_user') === null || localStorage.getItem('show_guide_user') === "") ? this.loadGuide() : "";

  }

  async loadGuide() {
    const modal = await this.modalController.create({
      component: WelcomePage,
      cssClass: "custom_class_1",
      componentProps: {
        'view': 'first',
        'img': '../../../assets/images/3d-curls-basketball-boy.png',
      }
    });
    await modal.present();


    //recheck the carts number upon modal dismissal
    (await modal.onWillDismiss()) ? this.cart_check() : "";

  }
  rate_check() {
    this.currency = (localStorage.getItem('currency') === null || localStorage.getItem('currency') === undefined || localStorage.getItem('currency') === "") ? "NGN" : localStorage.getItem('currency');
    if (localStorage.getItem('rates') === "" || localStorage.getItem('rates') === undefined || localStorage.getItem('rates') === null) {
      this.exchange();
      this.rates = JSON.parse(localStorage.getItem('rates'));
      this.rate_value = this.rates[this.currency];

    }
    else {
      this.rates = JSON.parse(localStorage.getItem('rates'));
      this.rate_value = this.rates.rates[this.currency];
      //  console.log(this.rate_value);
    }
  }
  ionViewDidLeave() {
    //alert('hi')
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

  check_profile() {
    //console.log(this.platform_class)
    this.logged = (localStorage.getItem('userProfile') === null || localStorage.getItem('userProfile') === "") ? true : false;
    this.cart_check();

    if (localStorage.getItem('userProfile') !== null) {
      let data = JSON.parse(localStorage.getItem('userProfile'));
      this.fullname = data.firstname + " " + data.lastname;
      this.dp = data.dp;
      //console.log(this.dp);
    }
    //
    // console.log(localStorage.getItem('userProfile'));


    //automate the next and previou
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
        'view': name,
        'category_id': id
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

  searchs(ev) {
    this.new_s = [];
    (this.filterValue === undefined) ? this.sFilter = "" : '';
    this.searchParam.find(res => {
      if (res.name.toLowerCase().includes(this.search.toLowerCase())) {
        this.new_s.push(res);
      }
      (this.filterValue == "products") ? this.products = this.new_s : this.store = this.new_s;
    })
    console.log(ev.detail.value.length)
    this.filterValue = (ev.detail.value.length) ? this.filterValue : undefined;
  }

  filter() {
    if (this.filterValue !== undefined || this.filterValue !== '') {
      this.sFilter = (this.filterValue == "products") ? 'Search products' : 'Search sellers';
      this.searchParam = (this.filterValue == "products") ? this.resp.data_1 : this.store;
    }
    else {
      this.sFilter = 'Search products';
      this.searchParam = this.resp.data_1;
    }
  }

  //go to store
  check_store(id) {
    let options: NavigationExtras = {
      queryParams: {
        shop_id: id
      }
    }
    this.navy.navigateForward(['shop'], options);
  }

  //cart_checker function here
  cart_check() {
    //get saved cart items
    this.list = (localStorage.getItem('carts') === null) ? [] : JSON.parse(localStorage.getItem('carts'));
    //console.log(this.list);
    this.counts = this.list.length;
  }
  customActionSheetOptions: any = {
    header: 'Please select a category to filter your search',
  };

  //scroll item
  scroll(event) {
    console.log(this.filterValue)
    this.content.scrollToBottom(3000);
    if (this.filterValue === undefined || this.filterValue === "") {
      //load pop here when there is no input
      this.sfilter.open();
    }
    else {
    }
  }

  //load item list
  load() {
    let count = this.categories.length;
    this.provider.products().subscribe(resp => {
      //store to local storage
      this.resp = resp;
      localStorage.setItem('total', JSON.stringify(this.resp.data_1));
      this.products = this.resp.data_1;
      this.itemer = this.resp.data_1;
      this.data = true;
      this.roll();
    })

  }

  roll() {
    let cnt;
    cnt = this.counting;
    if (this.store.length !== this.counting) {
      setTimeout(() => {
        this.slides.slideNext();
        this.slider.slideNext();
        cnt++;
        this.counting = cnt;
        this.roll();
      }, 3000);
    }
    else {
      this.roll_back()
    }
  }

  roll_back() {
    let cnt;
    cnt = this.counting;
    if (this.counting !== 1) {
      setTimeout(() => {
        this.slides.slidePrev();
        this.slider.slidePrev();
        cnt--;
        this.counting = cnt;
        this.roll_back();
      }, 3000);
    }
    else {
      this.roll();
    }
  }

  //check out on specific product here
  async product(id, shop_id, type) {
    // const modal = await this.modalController.create({
    //   component: ProductPage,
    //   cssClass: "custom",
    //   componentProps: {
    //     'id': id,
    //     'shop_id': shop_id,
    //     'type': type,
    //     'currency': this.currency
    //   }
    // });
    // await modal.present();
    // //recheck the carts number upon modal dismissal
    // (await modal.onWillDismiss()) ? this.cart_check() : "";

    //instead of former modal, load product as a page
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
        'type': 'carts',
        'currency': this.currency
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
      cssClass: 'bottom-sheet-popover',
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


  //control sliders here for mobile
  slideOptsMobile = {
    initialSlide: 1,
    slidesPerView: 2,
    loop: false,
    centeredSlides: true,
    spaceBetween: 0
  };

  //control slider for browser here
  slideOptsBrowser = {
    initialSlide: 1,
    slidesPerView: 3,
    loop: false,
    centeredSlides: true,
    spaceBetween: 0
  };

  //next and previus
  prev() {
    this.slides.slidePrev();
    this.slider.slidePrev();
  }
  next() {
    this.slides.slideNext();
    this.slider.slideNext();
  }


  //upon category selected, go to category page to prepare the products in that category for view
  category(item) {
    this.datas.save_category(item);
    this.router.navigate(['/categories']);
  }

  //direct routes here
  route(param) {
    this.navy.navigateForward(param);
  }

  //load extra data
  loadData(event) {

    setTimeout(() => {
      let total = JSON.parse(localStorage.getItem('total'));
      this.total = total;
      // console.log(event);
      event.target.complete();
      if (this.products.length === this.total.length) {
        event.target.disabled = true;
      }
      else {
        let res = this.total;
        let length = this.products.length;
        length++;
        res.length = length;
        this.products = res;
        // setTimeout(()=>{
        // this.content.scrollToBottom(3000);
        // },3000)

        //event.scrollToBottom(500);
        //this.product.length=length++;
      }
    }, 500)

  }
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
      data: 'run'
    });

  }

  //refresh upon pull down
  doRefresh(event) {
    this.starter(event);
  }
  //toasst
  //toast controller here
  async presentToast(params) {
    const toast = await this.toastController.create({
      message: params,
      duration: 2000
    });
    toast.present();
  }

  //loading controller here
  async loadingPresent(params) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: params,
      spinner: 'circles'
    }).then(a => {
      a.present().then(() => {
        //console.log('loading presented');
        if (!this.isLoading) {
          a.dismiss().then(() => { });
        }
      });
    });
  }


  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }
}

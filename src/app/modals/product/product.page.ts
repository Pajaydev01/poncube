import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LoadingController, ModalController, ToastController, IonContent, AlertController, PopoverController, NavController, NavParams } from '@ionic/angular';
import { CheckOutPage } from '../check-out/check-out.page';
import { ProviderService } from '../../providers/provider.service';
import { Platform, IonSlides } from '@ionic/angular';
import { RegisterPage } from '../register/register.page';
import { ImageViewPage } from '../image-view/image-view.page';
import { SellerViewPage } from '../../popover/seller-view/seller-view.page';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: 'product.page.html',
  styleUrls: ['product.page.scss']
})
export class ProductPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @Input() type: string;
  @Input() shop_id: string;
  @Input() item_id: any;
  //  @Input() currency:any;


  @ViewChild('slides') slides: IonSlides;
  @ViewChild('slider') slider: IonSlides;

  resp: any;
  cart_lists: any;
  product: boolean = false;
  carts: boolean = false;
  res: any;
  reser: any;
  unit: any = "";
  color: any;
  list: any;
  title: any;
  name: any;
  price: any;
  count: any;
  colors: any;
  image: any;
  description: any;
  delivery: any;
  option: any;
  options: any;
  selected: any = [];
  colorer: any;
  choices: any = [];
  delivery_choice: any = "";
  id: any;
  disp_image: any;
  seller_id: any;
  service: boolean = false;
  u_id: any;
  profileData: any;
  like: boolean = false;
  liker: boolean = false;
  item_type: any;
  c_likes: any;
  comment: any;
  resey: any;
  resp_s: any;
  isLoading: boolean;
  promo: any;
  promo_name: any;
  promo_price: any;
  percent: any;
  rates: any;
  rate_value: any = 1;
  currency: any;
  url: any;
  attachment: any;
  constructor(public modalController: ModalController,
    public toastController: ToastController, public provider: ProviderService,
    public platform: Platform, public alertController: AlertController, public loadingController: LoadingController,
    public popoverController: PopoverController,
    public navy: NavController,
    public navParams: NavParams,
    private routee: ActivatedRoute,
    private router: Router,
  ) {
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


  ngOnInit() {


  }
  ionViewWillEnter() {
    window.onpopstate = () => {
      this.dismiss();
      window.history.pushState(null, "", window.location.href);
    }

    this.currency = (localStorage.getItem('currency') === null || localStorage.getItem('currency') === undefined || localStorage.getItem('currency') === "") ? "NGN" : localStorage.getItem('currency');

    if (localStorage.getItem('rates') === "" || localStorage.getItem('rates') === undefined || localStorage.getItem('rates') === null) {
    }
    else {
      this.rates = JSON.parse(localStorage.getItem('rates'));
      this.rate_value = this.rates.rates[this.currency];
    }



    //  this.load_cart();
    const lists = JSON.parse(localStorage.getItem('carts'));
    this.cart_lists = lists.reverse();
    this.carts = true;
    this.title = "MY SHOPPING LISTS";
    this.liker = false;
    console.log(this.cart_lists)

    this.profileData = JSON.parse(localStorage.getItem('userProfile'));
  }

  //work on direct purchase to take them to check out page
  async buy(checker) {
    if (checker === "" || checker === undefined) {
      if (this.type === "product") {
        if (this.unit === "" || this.options.length === 0 || this.delivery_choice === "") {
          this.presentToast("Sorry, ensure you select a number of item, pick a prefered option and a delivery method");
        }
        else {
          //this.dismiss();
          let vel = this.res[0].delivery[this.delivery_choice];
          //first check if the user is logged in
          //load the check out modal and send out the details
          const modal = await this.modalController.create({
            component: CheckOutPage,
            cssClass: 'my-custom-class',
            componentProps: {
              'id': this.id,
              'name': this.name,
              'price': (this.promo !== "1") ? this.res[0].price : this.reser.price,
              'count': this.count,
              'image': this.image,
              'description': this.description,
              'unit': this.unit,
              'options': this.choices,
              'delivery': vel,
              'seller_id': this.seller_id,
              'item_type': this.type,
              'currency': this.currency
            }
          });
          return await modal.present();


        }
      }
      else {
        if (this.unit === "" || this.delivery_choice === "") {
          this.presentToast("kindly ensure you enter your service specifications and a delivery method");
        }
        else {
          let vel = this.res[0].delivery[this.delivery_choice];
          //first check if the user is logged in
          //load the check out modal and send out the details
          const modal = await this.modalController.create({
            component: CheckOutPage,
            cssClass: 'my-custom-class',
            componentProps: {
              'id': this.id,
              'name': this.name,
              'price': (this.promo !== "1") ? this.res[0].price : this.reser.price,
              'count': this.count,
              'image': this.image,
              'description': this.description,
              'unit': this.unit,
              'options': this.choices,
              'delivery': vel,
              'seller_id': this.seller_id,
              'item_type': this.type,
              'currency': this.currency,
              'attachment': this.attachment || ''
            }
          });
          return await modal.present();

        }
      }

    }
    else {
      //run without emptyness check here
      const modal = await this.modalController.create({
        component: CheckOutPage,
        cssClass: 'my-custom-class',
        componentProps: {
          'id': this.id,
          'name': this.name,
          'price': this.price,
          'count': this.count,
          'image': this.image,
          'description': this.description,
          'unit': this.unit,
          'options': this.options,
          'delivery': this.delivery,
          'seller_id': this.seller_id,
          'item_type': this.type,
          'u_id': this.u_id,
          'attachment': this.attachment || ''
        }
      });
      return await modal.present();
    }
  }

  //load the properties with data and send them out for check out
  checkout(id, name, price, count, image, description, unit, options, delivery_name, delivery_price, u_id, seller_id, item_type, attachment) {
    this.id = id,
      this.name = name,
      this.price = price;
    this.count = count;
    this.image = image;
    this.description = description;
    this.unit = unit;
    this.options = options;
    this.delivery = { name: delivery_name, price: delivery_price };
    this.seller_id = seller_id;
    this.type = item_type;
    this.u_id = u_id;
    this.attachment = attachment || ''
    //go to purchase
    this.buy("checked");

  }
  //load content into the cart here
  async load_cart() {
    const lists = JSON.parse(localStorage.getItem('carts'));
    this.cart_lists = lists.reverse();
    // this.carts = true;
    // this.title = "MY SHOPPING LISTS";
    // this.liker = false;
    const modal = await this.modalController.create({
      component: ProductPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'type': 'carts',
        'currency': this.currency
      }

    });
    await modal.present();
  }

  //remove items from cart here
  delist(params) {
    const res = this.cart_lists.filter(resp => resp.u_id !== params);
    this.cart_lists = res;
    localStorage.setItem('carts', JSON.stringify(this.cart_lists));
  }
  //pop up to update shipping address when shipping option is picked

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

  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }

  //dismiss modal here
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
      data: 'run'
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

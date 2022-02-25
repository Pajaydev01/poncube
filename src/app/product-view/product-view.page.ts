import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LoadingController, ModalController, ToastController, IonContent, AlertController, PopoverController, NavController, NavParams, IonRouterOutlet, } from '@ionic/angular';
import { CheckOutPage } from '../modals/check-out/check-out.page';
import { ProviderService } from '../providers/provider.service';
import { Platform, IonSlides } from '@ionic/angular';
import { RegisterPage } from '../modals/register/register.page';
import { ProductPage } from '../modals/product/product.page';
import { ImageViewPage } from '../modals/image-view/image-view.page';
import { SellerViewPage } from '../popover/seller-view/seller-view.page';
import { Router, ActivatedRoute } from '@angular/router';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.page.html',
  styleUrls: ['./product-view.page.scss'],
})
export class ProductViewPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;
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
  type: any;
  shop_id: any;
  item_id: any;
  pick: any = [];
  img_data: any = {};

  constructor(
    public modalController: ModalController,
    public toastController: ToastController, public provider: ProviderService,
    public platform: Platform, public alertController: AlertController, public loadingController: LoadingController,
    public popoverController: PopoverController,
    public navy: NavController,
    public navParams: NavParams,
    private routee: ActivatedRoute,
    private router: Router,
    private routerOutlet: IonRouterOutlet,
    private clipboard: Clipboard
  ) {
    this.routee.queryParams.subscribe(params => {
      //console.log(params)
      this.type = params["type"];
      this.shop_id = params["shop_id"];
      this.id = params["id"];

    });
  }

  ngOnInit() {
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

  check(option, choice, i) {
    //let's finnd a way to paint the selected one
    //
    if (this.pick == undefined || this.pick.length === 0) {
      let picks = {
        name: option,
        choice: choice
      }
      this.pick.push(picks);
    }
    else {
      if (this.pick.length === 1) {
        if (this.pick[0].name === option) {
          this.pick = [];
          let picks = {
            name: option,
            choice: choice
          }
          this.pick.push(picks);
        }
        else {
          let picks = {
            name: option,
            choice: choice
          }
          this.pick.push(picks);
        }
      }
      else {
        this.pick = [];
        let picks = {
          name: option,
          choice: choice
        }
        this.pick.push(picks);
      }
    }

    console.log(this.pick);
    let count = (this.options.length)
    let body = {
      option: option,
      choice: choice
    }
    //ensure they don't pick an opton twice
    if (this.choices.length === 0) {
      this.choices.push(body);
      //  this.content.scrollToPoint(100, 200, 1500);
    }
    else if (option !== this.choices[0].option) {
      if (this.choices.length !== count) {
        this.choices.push(body);
        //  this.content.scrollToPoint(100, 200, 1500);
      }
      else {
        this.choices = [];
        this.choices.push(body);
        //  this.content.scrollToPoint(100, 200, 1500);
      }
    }
    else {
      this.choices = [];
      this.choices.push(body);
      //  this.content.scrollToPoint(100, 200, 1500);
    }

  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        this.navy.navigateBack('/tabs/tab1');
      }
    });

    //add image here


    //handle currency here
    this.currency = (localStorage.getItem('currency') === null || localStorage.getItem('currency') === undefined || localStorage.getItem('currency') === "") ? "NGN" : localStorage.getItem('currency');

    if (localStorage.getItem('rates') === "" || localStorage.getItem('rates') === undefined || localStorage.getItem('rates') === null) {
    }
    else {
      this.rates = JSON.parse(localStorage.getItem('rates'));
      this.rate_value = this.rates.rates[this.currency];
    }

    if (this.type === "product") {
      this.liker = true;
      this.product_show();
    }
    else if (this.type === "service") {
      this.service_show()
      this.liker = true;
    }

    this.profileData = JSON.parse(localStorage.getItem('userProfile'));
  }

  //show product
  product_show() {
    var parent = this;
    //ping server to get the specifit product
    this.provider.get_product(this.id, this.shop_id).subscribe(res => {
      this.reser = res;
      //console.log(this.reser);
      //filter the array
      this.res = this.reser.item.filter(res => res.item_id == this.id);
      //console.log(this.res[0].name)
      this.name = this.res[0].name;
      this.price = (this.res[0].price * this.rate_value);
      this.count = this.reser.amount_sold;
      this.colors = this.res[0].colors;
      this.image = this.res[0].images;
      this.description = this.res[0].description;
      this.options = this.res[0].options;
      this.delivery = this.res[0].delivery;
      this.product = true;
      this.disp_image = this.image[0];
      this.seller_id = this.res[0].seller_id;
      this.title = "PRODUCTS";
      this.item_type = "product";
      this.promo = this.reser.promo;
      this.promo_name = this.reser.promo_name;
      this.promo_price = (this.reser.price * this.rate_value);
      this.percent = this.reser.percent;
      this.get_comment(this.seller_id, this.id);

      //console.log(this.profileData.phone);
      this.c_likes = (this.reser.favorite.length === 0 || this.reser.favorite === null) ? "0" : this.reser.favorite.length;
      if (this.reser.favorite.find(res => res == this.profileData.customer_id)) {
        this.like = true;
      }
      else {
        this.like = false;
      }


    }, err => {
      this.presentToast(err);
    })
  }

  //change dp for users here
  add_image = async ($event) => {
    let file = $event.target.files[0];
    const data = new FileReader();
    data.readAsDataURL(file);
    data.onload = (dataReader) => {
      this.img_data['file'] = dataReader;

      let image_data = (this.img_data['file'].target.result.substr(0, 22) === "data:image/png;base64,") ? this.img_data['file'].target.result.replace("data:image/png;base64,", "") : this.img_data['file'].target.result.replace("data:image/jpeg;base64,", "");

      //this will be uploaded
      this.img_data['to_upload'] = image_data;
      this.img_data['to_display'] = this.img_data['file'].target.result;
      //this.image=this.formData.target.result;
      //this.imager=true;
    }
  }

  remPic = () => {
    this.img_data = {};
  }

  service_show() {

    var parent = this;
    //ping server to get the specifit product
    this.provider.get_product(this.id, this.shop_id).subscribe(res => {
      this.reser = res;
      //  console.log(this.reser);
      //filter the array
      this.res = this.reser.item.filter(res => res.item_id == this.id);
      //console.log(this.res[0].name)
      this.name = this.res[0].name || "";
      this.price = (this.res[0].price * this.rate_value);
      this.count = this.res[0].amount_sold;
      this.colors = this.res[0].colors;
      this.image = this.res[0].images;
      this.description = this.res[0].description;
      this.options = this.res[0].options;
      this.delivery = this.res[0].delivery;
      this.service = true;
      this.disp_image = this.image[0];
      this.seller_id = this.res[0].seller_id;
      this.title = "SERVICE";
      this.item_type = "service";
      this.promo = this.reser.promo;
      this.promo_name = this.reser.promo_name;
      this.promo_price = (this.reser.price * this.rate_value);
      this.percent = this.reser.percent;
      this.get_comment(this.seller_id, this.id);

      this.c_likes = (this.reser.favorite === null) ? "0" : this.reser.favorite.length;
      if (this.reser.favorite !== null) {
        if (this.reser.favorite.find(res => res == this.profileData.customer_id)) {
          this.like = true;
        }
        else {
          this.like = false;
        }
      }
      else {

      }
    }, err => {
      this.presentToast(err);
    })
  }

  get_comment(seller, id) {
    let body = {
      seller_id: seller,
      item_id: id
    }

    this.provider.get_comm(body).subscribe(res => {
      this.resey = res;
      if (this.resey.message === "success") {
        ;
        this.comment = this.resey.comment;
      }
      else {
        //  this.presentToast(this.res.message);
        //console.log(this.resey.message)
      }
    }, err => {
      console.log(err);
      this.presentToast(err);
    })
  }

  async favorite() {
    if (JSON.parse(localStorage.getItem('userProfile')) === "" || JSON.parse(localStorage.getItem('userProfile')) === null) {
      this.presentToast("Kindly Sign in to add an item to your favorite");

      //load login modal
      //load the check out modal and send out the details
      const modal = await this.modalController.create({
        component: RegisterPage,
        cssClass: 'my-custom-class',
        componentProps: {
          'type': 'login',
        }
      });
      return await modal.present();

    }
    else {
      let body = {
        item_id: this.id,
        store_id: this.shop_id,
        session_id: localStorage.getItem('session_id'),
        description: this.description,
        item_type: this.item_type
      }
      //    console.log(body)
      this.provider.favorite(body).subscribe(res => {
        this.resp = res;
        if (this.resp.message === "success") {
          this.like = true;
        }
        else {
          console.log(this.resp.message)
        }
      }, err => {
        console.log(err);
      })
    }
  }

  async imageView(img) {
    //run without emptyness check here
    const modal = await this.modalController.create({
      component: ImageViewPage,
      cssClass: 'my-custom-class',
      componentProps: {
        img: img
      }
    });
    return await modal.present();
    //console.log(img)
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
              'attachment': this.img_data.to_upload || ''
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
          'attachment': this.img_data.to_upload || ''
        }
      });
      return await modal.present();
    }
  }

  //add products to cart here
  cart() {
    if (this.type === "product") {
      if (this.unit === "" || this.choices.length === 0 || this.delivery_choice === "") {
        this.presentToast("Sorry, ensure you select a number of item or Pick a preferred option and delivery method to proceed to purchase");
      }
      else {
        //check if they're logged in first
        //create a local array to store the product details and add them to the cart
        this.list = (localStorage.getItem('carts') !== null) ? JSON.parse(localStorage.getItem('carts')) : [];
        let vel = this.res[0].delivery[this.delivery_choice];
        //generate unique id
        let ids = Math.floor(Math.random() * 100000) + 1;
        console.log(vel)
        //console.log(this.list)
        this.list.push(
          {
            'id': this.id,
            'name': this.name,
            'price': (this.promo !== "1") ? this.res[0].price : this.reser.price,
            'count': this.count,
            'image': this.image,
            'description': this.description,
            'unit': this.unit,
            'options': this.choices,
            'delivery': vel,
            'u_id': ids,
            'seller_id': this.seller_id,
            'item_type': "product"
          });
        //create local storage
        localStorage.setItem('carts', JSON.stringify(this.list));

        //open the carts pane
        this.load_cart();
      }
    } else {
      if (this.unit === "" || this.delivery_choice === "") {
        this.presentToast("Sorry, ensure you input your  product specifications and delivery method to proceed to purchase");
      }
      else {
        //check if they're logged in first
        //create a local array to store the product details and add them to the cart
        this.list = (localStorage.getItem('carts') !== null) ? JSON.parse(localStorage.getItem('carts')) : [];
        let vel = this.res[0].delivery[this.delivery_choice];
        //generate unique id
        let ids = Math.floor(Math.random() * 100000) + 1;
        console.log(vel)
        //console.log(this.list)
        this.list.push(
          {
            'id': this.id,
            'name': this.name,
            'price': (this.promo !== "1") ? this.res[0].price : this.reser.price,
            'count': this.count,
            'image': this.image,
            'description': this.description,
            'unit': this.unit,
            'item_type': 'service',
            'delivery': vel,
            'u_id': ids,
            'seller_id': this.seller_id,
            'attachment': this.img_data.to_upload || ''
          });
        //create local storage
        localStorage.setItem('carts', JSON.stringify(this.list));

        //open the carts pane
        this.load_cart();
      }
    }
  }

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

  ship_check() {
    let vel = this.res[0].delivery[this.delivery_choice];
    //  console.log(vel.name)
    (vel.name === "Shipping") ? this.shippy() : "";
  }


  async shippy() {
    if (this.profileData === "" || this.profileData === null) {
      this.presentToast("Kindly Sign in to add an item to use this delivery method");

      //load login modal
      //load the check out modal and send out the details
      const modal = await this.modalController.create({
        component: RegisterPage,
        cssClass: 'my-custom-class',
        componentProps: {
          'type': 'login',
        }
      });
      return await modal.present();

    }
    else {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'UPDATE YOUR SHIPPING ADDRESS',
        inputs: [
          {
            name: 'address',
            type: 'text',
            placeholder: 'address'
          }
        ],
        buttons: [
          {
            text: 'Save',
            handler: (data) => {
              if (data.address === "") {
                this.presentToast("Please fill all fields ");
                return false;
              }
              else {
                this.loadingPresent("Updating, please wait..");
                let body = {
                  address: data.address,
                  session_id: localStorage.getItem('session_id')
                }
                this.provider.update_ship(body).subscribe(res => {
                  this.resp_s = res;
                  if (this.resp_s.message === "success") {
                    this.loadingDismiss();
                    this.presentToast('Shipping address saved');
                  }
                  else {
                    this.loadingDismiss();
                    console.log(this.resp_s.message)
                  }
                }, err => {
                  this.loadingDismiss();
                  console.log(err);
                  this.presentToast(err);
                })
                return true
              }
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');

            }
          }
        ]
      });

      await alert.present();
    }
  }

  //view seller
  async seller(id, ev) {
    const popover = await this.popoverController.create({
      component: SellerViewPage,
      cssClass: 'bottom-sheet-popover_2',
      event: ev,
      translucent: true,
      showBackdrop: true,
      componentProps: {
        'id': id
      }
    });
    await popover.present();

    await popover.onDidDismiss().then(res => {
      //  console.log(res.data)
      if (res.data === 'store') {
        //dismiss modal
        //this.dismiss();
      }
    });
  }

  //copy link url here
  share() {
    let url = 'https://poncube.com/product-view?type=' + this.type + '&id=' + this.id + '&shop_id=' + this.shop_id;
    if (this.platform.is("android") || this.platform.is("ios")) {
      console.log('native');
      this.clipboard.copy(url);
      this.presentToast('Link copied to clip board!');
    }
    else {
      console.log('non-native');
      let url = 'https://poncube.com/product-view?type=' + this.type + '&id=' + this.id + '&shop_id=' + this.shop_id;
      navigator.clipboard.writeText(url);
      this.presentToast('Link copied to clip board!');
    }
  }



  //Cube
  slideOption = {
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 40,
      shadowScale: 0.7,

    },
    on: {
      beforeInit: function() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: false,
          virtualTranslate: true,
        };

        this.params = Object.assign(this.params, overwriteParams);
        this.originalParams = Object.assign(this.originalParams, overwriteParams);
      },
      setTranslate: function() {
        const swiper = this;
        const {
          $el, $wrapperEl, slides, width: swiperWidth, height: swiperHeight, rtlTranslate: rtl, size: swiperSize,
        } = swiper;
        const params = swiper.params.cubeEffect;
        const isHorizontal = swiper.isHorizontal();
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let wrapperRotate = 0;
        let $cubeShadowEl;
        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $wrapperEl.append($cubeShadowEl);
            }
            $cubeShadowEl.css({ height: `${swiperWidth}px` });
          } else {
            $cubeShadowEl = $el.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $el.append($cubeShadowEl);
            }
          }
        }

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let slideIndex = i;
          if (isVirtual) {
            slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
          }
          let slideAngle = slideIndex * 90;
          let round = Math.floor(slideAngle / 360);
          if (rtl) {
            slideAngle = -slideAngle;
            round = Math.floor(-slideAngle / 360);
          }
          const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          let tx = 0;
          let ty = 0;
          let tz = 0;
          if (slideIndex % 4 === 0) {
            tx = -round * 4 * swiperSize;
            tz = 0;
          } else if ((slideIndex - 1) % 4 === 0) {
            tx = 0;
            tz = -round * 4 * swiperSize;
          } else if ((slideIndex - 2) % 4 === 0) {
            tx = swiperSize + (round * 4 * swiperSize);
            tz = swiperSize;
          } else if ((slideIndex - 3) % 4 === 0) {
            tx = -swiperSize;
            tz = (3 * swiperSize) + (swiperSize * 4 * round);
          }
          if (rtl) {
            tx = -tx;
          }

          if (!isHorizontal) {
            ty = tx;
            tx = 0;
          }

          const transform$$1 = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
          if (progress <= 1 && progress > -1) {
            wrapperRotate = (slideIndex * 90) + (progress * 90);
            if (rtl) wrapperRotate = (-slideIndex * 90) - (progress * 90);
          }
          $slideEl.transform(transform$$1);
          if (params.slideShadows) {
            // Set shadows
            let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
        }
        $wrapperEl.css({
          '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-moz-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-ms-transform-origin': `50% 50% -${swiperSize / 2}px`,
          'transform-origin': `50% 50% -${swiperSize / 2}px`,
        });

        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl.transform(`translate3d(0px, ${(swiperWidth / 2) + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
          } else {
            const shadowAngle = Math.abs(wrapperRotate) - (Math.floor(Math.abs(wrapperRotate) / 90) * 90);
            const multiplier = 1.5 - (
              (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2)
              + (Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2)
            );
            const scale1 = params.shadowScale;
            const scale2 = params.shadowScale / multiplier;
            const offset$$1 = params.shadowOffset;
            $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${(swiperHeight / 2) + offset$$1}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
          }
        }

        const zFactor = (swiper.browser.isSafari || swiper.browser.isUiWebView) ? (-swiperSize / 2) : 0;
        $wrapperEl
          .transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
      },
      setTransition: function(duration) {
        const swiper = this;
        const { $el, slides } = swiper;
        slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
        if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
          $el.find('.swiper-cube-shadow').transition(duration);
        }
      },
    }
  }
  dismiss() {
    this.navy.back();
  }

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

  async presentToast(params) {
    const toast = await this.toastController.create({
      message: params,
      duration: 2000
    });
    toast.present();
  }
}

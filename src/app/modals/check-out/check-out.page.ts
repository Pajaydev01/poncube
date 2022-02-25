import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController, ToastController, AlertController, NavController } from '@ionic/angular';
import { ProviderService } from '../../providers/provider.service';
import { RegisterPage } from '../register/register.page';
import { AddMoneyPage } from '../add-money/add-money.page';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
})
export class CheckOutPage implements OnInit {
  @Input() id: string;
  @Input() name: string;
  @Input() price: string;
  @Input() count: string;
  @Input() image: any;
  @Input() description: string;
  @Input() unit: string;
  @Input() options: string;
  @Input() delivery: any;
  @Input() seller_id: string;
  @Input() item_type: string;
  @Input() u_id: string;
  @Input() attachment: any;
  //@Input() currency:string;

  respo: any;
  total: any;
  details: any;
  seller_name: any;
  seller_mobile: any;
  seller_mail: any;
  seller_address: any;
  balance: any;
  profileData: any;
  product: boolean = false;
  service: boolean = false;
  token: any;
  resp: any;
  isLoading: boolean;
  store_id: any;
  list: any;
  rates: any;
  rate_value: any = 1;
  currency: any;
  dp: any;
  rating: any;
  rater: any = [];
  raty: any;
  constructor(public modalController: ModalController, public navy: NavController,
    public toastController: ToastController, public provider: ProviderService, public alertController: AlertController, public loadingController: LoadingController,) {
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.currency = (localStorage.getItem('currency') === null || localStorage.getItem('currency') === undefined || localStorage.getItem('currency') === "") ? "NGN" : localStorage.getItem('currency');


    //fetch currency rates
    if (localStorage.getItem('rates') === "" || localStorage.getItem('rates') === undefined || localStorage.getItem('rates') === null) {
      //  this.exchange();
      // this.rates=JSON.parse(localStorage.getItem('rates'));
      // this.rate_value=this.rates[this.currency];
      // console.log(this.rate_value);
    }
    else {
      this.rates = JSON.parse(localStorage.getItem('rates'));
      this.rate_value = this.rates.rates[this.currency];
      //console.log(this.rate_value);
    }


    if (this.item_type === "product") {
      console.log(this.delivery.price)
      this.product = true;
      this.total = parseFloat(this.price) * parseFloat(this.unit) + parseFloat(this.delivery.price);

    }
    else {
      this.service = true;
      // this.total=(parseFloat(this.price)+parseFloat(this.delivery.price))*parseFloat(this.rate_value);
      this.total = parseFloat(this.price) + parseFloat(this.delivery.price);
    }
    let body = {
      seller_id: this.seller_id
    }
    this.provider.get_seller_profile(body).subscribe(res => {
      this.details = res;
      this.seller_name = this.details.firstname + " " + this.details.lastname;
      this.seller_mobile = this.details.phone;
      this.seller_mail = this.details.email;
      this.seller_address = this.details.address;
      this.store_id = this.details.store_id;
      this.dp = this.details.dp;
      //console.log(this.store_id);
      let rat = (Math.round((this.details.rating) / 5));
      this.rating = [];
      console.log(rat)
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
    })
  }


  //go to store
  check_store(id) {
    let options: NavigationExtras = {
      queryParams: {
        shop_id: id
      }

    }
    this.dismiss();

    this.navy.navigateForward(['shop'], options);
  }



  //confirm puchase here
  async purchase() {
    //console.log(this.delivery);
    //first check if user is logged in
    if (localStorage.getItem('userProfile') === null || localStorage.getItem('userProfile') === "") {
      this.presentToast('Sorry, please login before proceeding');
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
      //check if the balance is sufficient
      this.balance = localStorage.getItem('balance');
      if (parseInt(this.total) > parseInt(this.balance)) {
        this.presentToast("Sorry, you do not have a sufficient balance to make this purchase, kindly add money to your wallet to proceed");
        //load crdit addition modal
      }
      else {
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
                      this.purchase_product();
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
    }
  }


  //proceed to make purchase here
  purchase_product() {
    this.seller_name = this.details.firstname + " " + this.details.lastname;
    this.seller_mobile = this.details.phone;
    this.seller_mail = this.details.email;
    this.seller_address = this.details.address;
    this.store_id = this.details.store_id;
    let body;
    if (this.item_type === "product") {
      body = {
        store_id: this.store_id,
        customer_id: this.seller_id,
        item_id: this.id,
        product_name: this.name,
        product_price: this.total,
        product_delivery: this.delivery,
        product_options: this.options,
        product_image: this.image[0],
        product_unit: this.unit,
        seller_id: this.seller_id,
        category: "product",
        session_id: localStorage.getItem('session_id')
      }
    }
    else {
      body = {
        store_id: this.store_id,
        customer_id: this.seller_id,
        item_id: this.id,
        product_name: this.name,
        product_price: this.total,
        product_delivery: this.delivery,
        product_image: this.image[0],
        product_unit: this.unit,
        seller_id: this.seller_id,
        category: "service",
        attachment: this.attachment || '',
        session_id: localStorage.getItem('session_id')
      }
    }
    console.log(body);

    this.provider.purchase(body).subscribe(res => {
      this.respo = res;
      if (this.respo.message === "success") {
        this.dismiss();
        this.loadingDismiss();
        this.payment();

      }
      else {
        this.presentToast(this.respo.message);
        this.loadingDismiss();
        console.log(this.respo.message);
      }
    }, err => {
      this.loadingDismiss();
      this.presentToast(err);
      console.log(err);
    })
  }

  payment() {
    let body = {
      session_id: localStorage.getItem('session_id'),
      amount: this.total,
      ref: `${Math.ceil(Math.random() * 10e10)}`,
      method: 'subtract'
    }

    this.loadingPresent("Please wait...");
    this.provider.add_money(body).subscribe(res => {
      this.resp = res;
      if (this.resp.message === "success") {
        this.loadingDismiss();
        localStorage.setItem('balance', this.resp.balance);
        this.presentToast("Your purchase was successful");
        this.navy.navigateRoot('tabs/tab3');

        if (this.u_id !== "") {
          this.list = JSON.parse(localStorage.getItem('carts'));
          const res = this.list.filter(resp => resp.u_id !== this.u_id);
          localStorage.setItem('carts', JSON.stringify(res));
          this.dismiss()
        }
        else {
          this.dismiss()
        }
      }
      else {
        this.loadingDismiss();
        this.presentToast(this.resp.message);
      }
    }, err => {
      this.loadingDismiss();
      this.presentToast(err);

      this.modalController.dismiss({
        'dismissed': true,
        data: 'run'
      });
    })
  }

  //Cube
  slideOptions = {
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
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
  //dismiss modal here
  dismiss() {
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

}

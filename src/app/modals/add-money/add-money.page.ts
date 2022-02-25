import { Component, OnInit, Input } from '@angular/core';
import { PaystackOptions } from 'angular4-paystack';
import { LoadingController, ModalController, ToastController, IonContent, NavController } from '@ionic/angular';
import { ProviderService } from '../../providers/provider.service';
import { Flutterwave, InlinePaymentOptions, PaymentSuccessResponse } from "flutterwave-angular-v3"

declare var FlutterwaveCheckout;
@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.page.html',
  styleUrls: ['./add-money.page.scss'],
})
export class AddMoneyPage implements OnInit {
  @Input() usermail: string;
  @Input() username: string;
  @Input() userphone: string;
  amnt: number;
  pays: boolean = true;
  payss: boolean = false;
  resp: any;
  isLoading: boolean;
  refs: any;
  options: PaystackOptions = {
    amount: 0,
    email: '',
    ref: ''
  }

  constructor(public modalController: ModalController, public provider: ProviderService, public loadingController: LoadingController, public toastController: ToastController, public navy: NavController,
    private flutterwave: Flutterwave) { }

  ngOnInit() {
  }

  pay() {
    var parent = this;
    this.refs = `${Math.ceil(Math.random() * 10e10)}`
    //fluuterwave
    const paymentData: InlinePaymentOptions = {
      public_key: "FLWPUBK-cdca6aa57622682dbdc45cb937a08ca0-X",
      tx_ref: this.refs,
      amount: this.amnt,
      currency: 'NGN',
      payment_options: ' ',
      redirect_url: '',
      customer: {
        email: parent.usermail,
        phone_number: parent.userphone,
        name: parent.username,
      },
      customizations: {
        title: "Wallet recharge",
        description: "Walllet recharge",
        logo: "https://poncube.com/assets/images/favy.jpg",
      },
      callback: this.makePaymentCallback,
      onclose: this.closedPaymentModal,
      callbackContext: this
    }

    this.makePayment(paymentData);
  }
  makePayment(paymentData) {
    this.flutterwave.inlinePay(paymentData)
  }
  makePaymentCallback(response: PaymentSuccessResponse): void {
    //  console.log("Payment callback", response);
    if (response.status === 'successful') {
      this.paymentDone(response.transaction_id);
    }
    else {
      console.log('error');
    }
  }

  closedPaymentModal(): void {
    console.log('payment is closed');
  }

  paymentDone(ref: any) {
    this.loadingPresent('Please hold on while we process your transactions');
    // this.title = 'Payment successfull';
    // console.log(this.title, ref);
    let body = {
      session_id: localStorage.getItem('session_id'),
      amount: this.amnt,
      ref: ref,
      method: 'add'
    }

    //add the money to the wallet and dismiss the previous modal
    this.provider.add_money(body).subscribe(res => {
      this.resp = res;
      if (this.resp.message === "success") {
        this.loadingDismiss();
        localStorage.setItem('balance', this.resp.balance);
        this.modalController.dismiss({
          'dismissed': true,
          data: 'run'
        });
      }
      else {
        this.loadingDismiss();
        this.presentToast(this.resp.message);

        this.modalController.dismiss({
          'dismissed': true,
          data: 'run'
        });
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
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
      data: 'run'
    });
  }

  paymentCancel() {
    console.log('payment failed');
    this.presentToast("Payment failed");
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

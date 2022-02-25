import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent, NavController, Platform } from '@ionic/angular';
import { ProviderService } from '../../providers/provider.service';
import { PopoverController } from '@ionic/angular';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

declare var FB;
@Component({
  selector: 'app-footers',
  templateUrl: './footers.page.html',
  styleUrls: ['./footers.page.scss'],
})
export class FootersPage implements OnInit {
  @Input() type: any;
  @Input() dp: any;
  @Input() name: any;
  @Input() id: any;
  information: boolean = false;
  c_service: boolean = false;
  extra: boolean = false;
  menu: boolean = false;
  isLoading: boolean;
  ad_res: any;
  address: any;
  constructor(public navy: NavController,
    public provider: ProviderService,
    public loadingController: LoadingController, public popoverController: PopoverController,
    private authService: SocialAuthService) {
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
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.type === "information") {
      this.information = true;
    }
    else if (this.type === "c_service") {
      this.c_service = true;
    }
    else if (this.type === "extra") {
      this.extra = true;
    }
    else if (this.type === "menu") {
      this.menu = true;
    }
    else if (this.type === "shipping") {
      this.get_address();
    }
  }
  get_address() {
    let body = {
      session_id: localStorage.getItem('session_id'),
      customer_id: this.id,
      type: "address"
    }
    this.provider.get_address(body).subscribe(res => {
      this.ad_res = res;
      this.address = this.ad_res.address;
      //  console.log(this.ad_res.address);
      if (this.ad_res.message !== "success") {
        console.log(this.ad_res.message);
      }
    }, err => {
      console.log(err)
    })
  }

  //direct routes here
  route(param) {
    this.navy.navigateForward(param);
    this.popoverController.dismiss();
  }

  //logout here
  logout() {
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
        this.popoverController.dismiss();
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
        this.popoverController.dismiss();
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
        this.popoverController.dismiss();
      });
    }

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


  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController, NavParams, ToastController, NavController, AlertController } from '@ionic/angular';
import { ProviderService } from '../../providers/provider.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

declare var FB;

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage implements OnInit {
  //get form input parameters
  f_name: any = "";
  l_name: any = "";
  email: any = "";
  phone: any = "";
  address: any = "";
  password: any = "";
  c_password: any = "";
  newsletter: any = "";
  terms: any;
  pass_match: boolean = false;
  data_r: any;
  respie: any;
  //get form input parameters
  Sname: any = "";
  caption: any = ""
  sDetails: any = "";
  Saddress: any = "";
  Sterms: any;
  image: any = "";
  images: any;
  resp: any;
  formData: any;
  imager: boolean = false;
  //login parameters details here
  r_name: any = "";
  r_pass: any = "";

  //seller account informations
  s_name: any = "";
  s_pass: any = "";
  reset: boolean = false;

  s_register: boolean = false;
  s_login: boolean = false;
  isLoading: boolean;
  register: boolean = false;
  login: boolean = false;
  mode: any;
  countries: any;
  country: any;
  initialized: boolean = false;

  reset_mail: any = "";

  public type = this.navParams.get('value');

  constructor(
    public navy: NavController,
    public provider: ProviderService,
    public modalController: ModalController,
    private navParams: NavParams,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    private authService: SocialAuthService
  ) {
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

    this.authService.initState.subscribe(() => {

    }, console.error, () => {
      //make button appear when all providers are ready
      this.initialized = true;
    });
  }
  //set observables to se if google services are reasdy


  //login in with google
  loginWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(resp => {
      //  console.log(resp);
      const first_name = resp.firstName;
      const last_name = resp.lastName;
      const email = resp.email;
      const id = resp.idToken;


      this.loadingPresent('Please wait...');
      this.provider.register_fb(first_name, last_name, email, id, "fb").subscribe(resp => {
        this.data_r = resp;
        if (this.data_r.message === "success") {
          this.loadingDismiss();
          localStorage.setItem('login_type', 'google');
          localStorage.setItem('session_id', this.data_r.session_id);
          //console.log(this.data_r.session_id);
          //dismiss modal and route to profile page
          this.dismiss();
          this.navy.navigateRoot('tabs/tab3');
        }
        else {
          this.loadingDismiss();
          console.log(this.data_r.message);
          this.presentToast(this.data_r.message);
        }
      }, err => {
        this.loadingDismiss();
        this.presentToast('Sorry, an error occured');
        console.log(err);
      });
    }).catch(err => {
      console.log(err)
    })
    //get the credentias and authenticate
  }


  //open fb lgin diaog
  fb_login() {
    let parent = this;
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        parent.fb_log(response);
      } else if (response.status === 'not_authorized') {
        FB.login(function(response) {
          // handle the response
          if (response.authResponse) {
            parent.fb_login();
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
        }, { scope: 'public_profile,email', perms: 'user_address, user_mobile_phone' });
      } else {
        FB.login(function(response) {
          // handle the response
          if (response.authResponse) {
            parent.fb_login();
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
        }, { scope: 'public_profile,email', perms: 'user_address, user_mobile_phone' });
      }
    });
  }

  fb_log(res) {
    let parent = this;
    var uid = res.authResponse.userID;
    var accessToken = res.authResponse.accessToken;
    //make a call to the graph api to get the informations with the access token
    FB.api(
      '/' + uid + '/?fields=id,first_name,last_name,name,email,address',
      'GET',
      {},
      function(response) {
        // Insert your code here
        //  console.log(response);
        let email = response.email;
        let first_name = response.first_name;
        let last_name = response.last_name;
        let id = response.id;

        parent.loadingPresent('Please wait...');
        parent.provider.register_fb(first_name, last_name, email, id, "fb").subscribe(resp => {
          parent.data_r = resp;
          if (parent.data_r.message === "success") {
            localStorage.setItem('login_type', 'facebook');
            parent.loadingDismiss();
            localStorage.setItem('session_id', parent.data_r.session_id);
            //  console.log(parent.data_r.session_id);
            //dismiss modal and route to profile page
            parent.dismiss();
            parent.navy.navigateRoot('tabs/tab3');
          }
          else {
            parent.loadingDismiss();
            console.log(parent.data_r.message);
            parent.presentToast(parent.data_r.message);
          }
        }, err => {
          parent.loadingDismiss();
          parent.presentToast('Sorry, an error occured');
          console.log(err);
        });

      }
    );
  }

  //open the login space here
  logger() {
    this.login = true;
    this.register = false;
    this.s_login = false;
    this.mode = "LOGIN";
  }
  regger() {
    this.login = false;
    this.register = true;
    this.s_login = false;
    this.reset = false;
    this.mode = "REGISTER";
  }
  seller() {
    this.login = false;
    this.register = false;
    this.s_login = true;
    this.mode = "SHOP LOGIN";
  }
  //reseter here
  resets() {
    this.login = false;
    this.register = false;
    this.reset = true;
    this.mode = "RESET PASSWORD";
  }


  //reset
  reseter() {
    if (this.reset_mail === "") {
      this.presentToast("Please enter your mail or phone number to reset");
    }
    else {
      let body = {
        param: this.reset_mail
      }
      this.loadingPresent("FInding account, please wait....");
      this.provider.reset(body).subscribe(res => {
        this.respie = res;
        if (this.respie.message === "success") {
          this.loadingDismiss();
          this.presentToast("The reset link has been sent to the associated mail, kindly check the mail to proceed to reset your account");
        }
        else {
          this.loadingDismiss();
          this.presentToast(this.respie.message);
        }
      }, err => {
        this.loadingDismiss();
        this.presentToast(err);
      })
    }
  }

  //check if password matches here
  pass_check() {
    //  console.log(this.password)
    if (parseInt(this.c_password) === parseInt(this.password)) {
      this.pass_match = true;
    }
    else {
      this.pass_match = false;
    }
  }
  //initiate registeration here
  registers() {

    if (this.f_name === "" || this.l_name === "" || this.email === "" || this.phone === "" || this.address === "" || this.c_password === "") {
      this.presentToast('Please fill all fields');
      //this.loadingPresent("Registering, please wait....");
    }
    else {
      if (this.c_password === this.password) {
        //confirm if they have confirm terms of service
        if (this.terms === false || this.terms === undefined) {
          this.presentToast("kindly check the terms of use");
        }
        else {
          //proceed to process registration
          this.loadingPresent('Registering, please wait...');
          this.provider.register(this.f_name, this.l_name, this.email, this.country + this.phone, this.c_password, this.newsletter, this.address, "normal").subscribe(resp => {
            this.data_r = resp;
            if (this.data_r.message === "success") {
              this.loadingDismiss();

              //send sms in bg here
              let body = {
                "from": "PONCUBE",
                "to": this.country + this.phone,
                "text": "Welcome to PONCUBE " + this.f_name + " your transaction token is: " + this.data_r.token + " do not share with anyone"
              }
              this.provider.sendText(body).subscribe(resp => {
                //console.log(resp)
              })

              localStorage.setItem('session_id', this.data_r.session_id);
              //  console.log(this.data_r.session_id);
              //dismiss modal and route to profile page
              localStorage.setItem('login_type', 'normal');
              this.dismiss();
              this.navy.navigateRoot('tabs/tab3');
            }
            else {
              this.loadingDismiss();
              console.log(this.data_r.message);
              this.presentToast(this.data_r.message);
            }
          }, err => {
            this.loadingDismiss();
            this.presentToast('Sorry, an error occured');
            console.log(err);
          }
          )

        }
      }
      else {
        this.presentToast("Sorry, password do not match");
      }
    }
  }

  //initiate  login here
  logins() {
    if (this.r_pass === "" || this.r_name === "") {
      this.presentToast("Kindly fill all fields");
    }
    else {
      this.loadingPresent('Please wait..');
      //process login here
      this.provider.login(this.r_name, this.r_pass, 'login').subscribe(resp => {
        this.data_r = resp;

        if (this.data_r.message === "success") {
          this.loadingDismiss();
          localStorage.setItem('session_id', this.data_r.session_id);
          //console.log(this.data_r.session_id);
          //dismiss modal and route to profile page
          localStorage.setItem('login_type', 'normal');
          this.dismiss();
          this.navy.navigateRoot('tabs/tab3');
        }
        else if (this.data_r.message === "logged") {
          this.loadingDismiss();
          this.login_alert();
        }
        else {
          this.loadingDismiss();
          this.presentToast(this.data_r.message);
        }
      }, err => {
        this.loadingDismiss();
        this.presentToast('Sorry, an error occured');
        console.log(err);
      }
      )
    }
  }

  //handle already logged in account here
  async login_alert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Account logged in in another device...',
      message: '<strong>To proceed to use here, kindly wait a few second while we await authorization on the other device</strong>',
      buttons: [
        {
          text: 'Proceed',
          cssClass: 'secondary',
          handler: () => {
            this.loadingPresent("Please wait...");
            setTimeout(() => {
              this.provider.login(this.r_name, this.r_pass, 'proceed').subscribe(resp => {
                this.data_r = resp;
                if (this.data_r.message === "success") {
                  this.loadingDismiss();
                  localStorage.setItem('session_id', this.data_r.session_id);
                  localStorage.setItem('login_type', 'facebook');
                  //console.log(this.data_r.session_id);
                  //dismiss modal and route to profile page
                  this.dismiss();

                  this.navy.navigateRoot('tabs/tab3');
                }
                else if (this.data_r.message === "logged") {
                  this.loadingDismiss();
                  this.login_alert();
                }
                else {
                  this.loadingDismiss();
                  this.presentToast(this.data_r.message);
                }
              }, err => {
                this.loadingDismiss();
                this.presentToast('Sorry, an error occured');
                console.log(err);
              });
            }, 3000);
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

  //upload documents here
  Sregisters() {
    if (this.Sname === "" || this.caption === "" || this.sDetails === "" || this.Saddress === "") {
      this.presentToast("Kindly fill all fields");
    }
    else if (this.Sterms === false || this.Sterms === undefined) {
      this.presentToast("Kindly check the privacy policy agreement before proceeding...");
    }
    else if (this.images === "" || this.images === undefined) {
      this.presentToast("Kindly upload an image for your store");
    }
    else {
      //upload here
      let body = {
        shop_name: this.Sname,
        shop_details: this.sDetails,
        caption: this.caption,
        shop_address: this.Saddress,
        image: this.images,
        session_id: localStorage.getItem('session_id')
      }
      this.loadingPresent("Please wait...");
      this.provider.turn_seller(body).subscribe(res => {
        this.resp = res;
        if (this.resp.message === "success") {
          this.loadingDismiss();
          this.dismiss();

          this.presentToast("Congratulations, your seller profile has been created, please wait while the admin confirms and acivate your account, then you'll be able to access your shop and sell");
        }
        else {
          this.loadingDismiss();
          this.presentToast(this.resp.message);
        }
      }, err => {
        this.loadingDismiss();
      })
    }
  }

  //add image for seller item here
  //add image
  add_image($event) {
    let file = $event.target.files[0];
    const data = new FileReader();
    data.readAsDataURL(file);
    data.onload = (dataReader) => {
      this.formData = dataReader;

      let image_data = (this.formData.target.result.substr(0, 22) === "data:image/png;base64,") ? this.formData.target.result.replace("data:image/png;base64,", "") : this.formData.target.result.replace("data:image/jpeg;base64,", "");

      this.images = image_data;
      this.image = this.formData.target.result;
      this.imager = true;
    }

  }



  //loading controller here
  async loadingPresent(params) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: params,
      spinner: "lines"
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
      duration: 5000
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

  ngOnInit() {
    if (this.type === "register") {
      this.register = true;
    }
    else if (this.type === "login") {
      this.login = true;
    }
    else if (this.type === "s_login") {
      this.s_login = true;
    }
    else if (this.type === "s_register") {
      this.s_register = true;
      this.type = "Shop";
    }
    this.mode = this.type.toUpperCase();
    //land Islands
    //countrsies here
    this.countries = [{
      name: "United States",
      dial_code: "1",
      code: "US"
    }, {
      name: "Israel",
      dial_code: "972",
      code: "IL"
    }, {
      name: "Afghanistan",
      dial_code: "93",
      code: "AF"
    }, {
      name: "Albania",
      dial_code: "355",
      code: "AL"
    }, {
      name: "Algeria",
      dial_code: "213",
      code: "DZ"
    }, {
      name: "AmericanSamoa",
      dial_code: "1 684",
      code: "AS"
    }, {
      name: "Andorra",
      dial_code: "376",
      code: "AD"
    }, {
      name: "Angola",
      dial_code: "244",
      code: "AO"
    }, {
      name: "Anguilla",
      dial_code: "1 264",
      code: "AI"
    }, {
      name: "Antigua and Barbuda",
      dial_code: "1268",
      code: "AG"
    }, {
      name: "Argentina",
      dial_code: "54",
      code: "AR"
    }, {
      name: "Armenia",
      dial_code: "374",
      code: "AM"
    }, {
      name: "Aruba",
      dial_code: "297",
      code: "AW"
    }, {
      name: "Australia",
      dial_code: "61",
      code: "AU"
    }, {
      name: "Austria",
      dial_code: "43",
      code: "AT"
    }, {
      name: "Azerbaijan",
      dial_code: "994",
      code: "AZ"
    }, {
      name: "Bahamas",
      dial_code: "1 242",
      code: "BS"
    }, {
      name: "Bahrain",
      dial_code: "973",
      code: "BH"
    }, {
      name: "Bangladesh",
      dial_code: "880",
      code: "BD"
    }, {
      name: "Barbados",
      dial_code: "1 246",
      code: "BB"
    }, {
      name: "Belarus",
      dial_code: "375",
      code: "BY"
    }, {
      name: "Belgium",
      dial_code: "32",
      code: "BE"
    }, {
      name: "Belize",
      dial_code: "501",
      code: "BZ"
    }, {
      name: "Benin",
      dial_code: "229",
      code: "BJ"
    }, {
      name: "Bermuda",
      dial_code: "1 441",
      code: "BM"
    }, {
      name: "Bhutan",
      dial_code: "975",
      code: "BT"
    }, {
      name: "Bosnia and Herzegovina",
      dial_code: "387",
      code: "BA"
    }, {
      name: "Botswana",
      dial_code: "267",
      code: "BW"
    }, {
      name: "Brazil",
      dial_code: "55",
      code: "BR"
    }, {
      name: "British Indian Ocean Territory",
      dial_code: "246",
      code: "IO"
    }, {
      name: "Bulgaria",
      dial_code: "359",
      code: "BG"
    }, {
      name: "Burkina Faso",
      dial_code: "226",
      code: "BF"
    }, {
      name: "Burundi",
      dial_code: "257",
      code: "BI"
    }, {
      name: "Cambodia",
      dial_code: "855",
      code: "KH"
    }, {
      name: "Cameroon",
      dial_code: "237",
      code: "CM"
    }, {
      name: "Canada",
      dial_code: "1",
      code: "CA"
    }, {
      name: "Cape Verde",
      dial_code: "238",
      code: "CV"
    }, {
      name: "Cayman Islands",
      dial_code: " 345",
      code: "KY"
    }, {
      name: "Central African Republic",
      dial_code: "236",
      code: "CF"
    }, {
      name: "Chad",
      dial_code: "235",
      code: "TD"
    }, {
      name: "Chile",
      dial_code: "56",
      code: "CL"
    }, {
      name: "China",
      dial_code: "86",
      code: "CN"
    }, {
      name: "Christmas Island",
      dial_code: "61",
      code: "CX"
    }, {
      name: "Colombia",
      dial_code: "57",
      code: "CO"
    }, {
      name: "Comoros",
      dial_code: "269",
      code: "KM"
    }, {
      name: "Congo",
      dial_code: "242",
      code: "CG"
    }, {
      name: "Cook Islands",
      dial_code: "682",
      code: "CK"
    }, {
      name: "Costa Rica",
      dial_code: "506",
      code: "CR"
    }, {
      name: "Croatia",
      dial_code: "385",
      code: "HR"
    }, {
      name: "Cuba",
      dial_code: "53",
      code: "CU"
    }, {
      name: "Cyprus",
      dial_code: "537",
      code: "CY"
    }, {
      name: "Czech Republic",
      dial_code: "420",
      code: "CZ"
    }, {
      name: "Denmark",
      dial_code: "45",
      code: "DK"
    }, {
      name: "Djibouti",
      dial_code: "253",
      code: "DJ"
    }, {
      name: "Dominica",
      dial_code: "1 767",
      code: "DM"
    }, {
      name: "Dominican Republic",
      dial_code: "1 849",
      code: "DO"
    }, {
      name: "Ecuador",
      dial_code: "593",
      code: "EC"
    }, {
      name: "Egypt",
      dial_code: "20",
      code: "EG"
    }, {
      name: "El Salvador",
      dial_code: "503",
      code: "SV"
    }, {
      name: "Equatorial Guinea",
      dial_code: "240",
      code: "GQ"
    }, {
      name: "Eritrea",
      dial_code: "291",
      code: "ER"
    }, {
      name: "Estonia",
      dial_code: "372",
      code: "EE"
    }, {
      name: "Ethiopia",
      dial_code: "251",
      code: "ET"
    }, {
      name: "Faroe Islands",
      dial_code: "298",
      code: "FO"
    }, {
      name: "Fiji",
      dial_code: "679",
      code: "FJ"
    }, {
      name: "Finland",
      dial_code: "358",
      code: "FI"
    }, {
      name: "France",
      dial_code: "33",
      code: "FR"
    }, {
      name: "French Guiana",
      dial_code: "594",
      code: "GF"
    }, {
      name: "French Polynesia",
      dial_code: "689",
      code: "PF"
    }, {
      name: "Gabon",
      dial_code: "241",
      code: "GA"
    }, {
      name: "Gambia",
      dial_code: "220",
      code: "GM"
    }, {
      name: "Georgia",
      dial_code: "995",
      code: "GE"
    }, {
      name: "Germany",
      dial_code: "49",
      code: "DE"
    }, {
      name: "Ghana",
      dial_code: "233",
      code: "GH"
    }, {
      name: "Gibraltar",
      dial_code: "350",
      code: "GI"
    }, {
      name: "Greece",
      dial_code: "30",
      code: "GR"
    }, {
      name: "Greenland",
      dial_code: "299",
      code: "GL"
    }, {
      name: "Grenada",
      dial_code: "1 473",
      code: "GD"
    }, {
      name: "Guadeloupe",
      dial_code: "590",
      code: "GP"
    }, {
      name: "Guam",
      dial_code: "1 671",
      code: "GU"
    }, {
      name: "Guatemala",
      dial_code: "502",
      code: "GT"
    }, {
      name: "Guinea",
      dial_code: "224",
      code: "GN"
    }, {
      name: "Guinea-Bissau",
      dial_code: "245",
      code: "GW"
    }, {
      name: "Guyana",
      dial_code: "595",
      code: "GY"
    }, {
      name: "Haiti",
      dial_code: "509",
      code: "HT"
    }, {
      name: "Honduras",
      dial_code: "504",
      code: "HN"
    }, {
      name: "Hungary",
      dial_code: "36",
      code: "HU"
    }, {
      name: "Iceland",
      dial_code: "354",
      code: "IS"
    }, {
      name: "India",
      dial_code: "91",
      code: "IN"
    }, {
      name: "Indonesia",
      dial_code: "62",
      code: "ID"
    }, {
      name: "Iraq",
      dial_code: "964",
      code: "IQ"
    }, {
      name: "Ireland",
      dial_code: "353",
      code: "IE"
    }, {
      name: "Israel",
      dial_code: "972",
      code: "IL"
    }, {
      name: "Italy",
      dial_code: "39",
      code: "IT"
    }, {
      name: "Jamaica",
      dial_code: "1 876",
      code: "JM"
    }, {
      name: "Japan",
      dial_code: "81",
      code: "JP"
    }, {
      name: "Jordan",
      dial_code: "962",
      code: "JO"
    }, {
      name: "Kazakhstan",
      dial_code: "7 7",
      code: "KZ"
    }, {
      name: "Kenya",
      dial_code: "254",
      code: "KE"
    }, {
      name: "Kiribati",
      dial_code: "686",
      code: "KI"
    }, {
      name: "Kuwait",
      dial_code: "965",
      code: "KW"
    }, {
      name: "Kyrgyzstan",
      dial_code: "996",
      code: "KG"
    }, {
      name: "Latvia",
      dial_code: "371",
      code: "LV"
    }, {
      name: "Lebanon",
      dial_code: "961",
      code: "LB"
    }, {
      name: "Lesotho",
      dial_code: "266",
      code: "LS"
    }, {
      name: "Liberia",
      dial_code: "231",
      code: "LR"
    }, {
      name: "Liechtenstein",
      dial_code: "423",
      code: "LI"
    }, {
      name: "Lithuania",
      dial_code: "370",
      code: "LT"
    }, {
      name: "Luxembourg",
      dial_code: "352",
      code: "LU"
    }, {
      name: "Madagascar",
      dial_code: "261",
      code: "MG"
    }, {
      name: "Malawi",
      dial_code: "265",
      code: "MW"
    }, {
      name: "Malaysia",
      dial_code: "60",
      code: "MY"
    }, {
      name: "Maldives",
      dial_code: "960",
      code: "MV"
    }, {
      name: "Mali",
      dial_code: "223",
      code: "ML"
    }, {
      name: "Malta",
      dial_code: "356",
      code: "MT"
    }, {
      name: "Marshall Islands",
      dial_code: "692",
      code: "MH"
    }, {
      name: "Martinique",
      dial_code: "596",
      code: "MQ"
    }, {
      name: "Mauritania",
      dial_code: "222",
      code: "MR"
    }, {
      name: "Mauritius",
      dial_code: "230",
      code: "MU"
    }, {
      name: "Mayotte",
      dial_code: "262",
      code: "YT"
    }, {
      name: "Mexico",
      dial_code: "52",
      code: "MX"
    }, {
      name: "Monaco",
      dial_code: "377",
      code: "MC"
    }, {
      name: "Mongolia",
      dial_code: "976",
      code: "MN"
    }, {
      name: "Montenegro",
      dial_code: "382",
      code: "ME"
    }, {
      name: "Montserrat",
      dial_code: "1664",
      code: "MS"
    }, {
      name: "Morocco",
      dial_code: "212",
      code: "MA"
    }, {
      name: "Myanmar",
      dial_code: "95",
      code: "MM"
    }, {
      name: "Namibia",
      dial_code: "264",
      code: "NA"
    }, {
      name: "Nauru",
      dial_code: "674",
      code: "NR"
    }, {
      name: "Nepal",
      dial_code: "977",
      code: "NP"
    }, {
      name: "Netherlands",
      dial_code: "31",
      code: "NL"
    }, {
      name: "Netherlands Antilles",
      dial_code: "599",
      code: "AN"
    }, {
      name: "New Caledonia",
      dial_code: "687",
      code: "NC"
    }, {
      name: "New Zealand",
      dial_code: "64",
      code: "NZ"
    }, {
      name: "Nicaragua",
      dial_code: "505",
      code: "NI"
    }, {
      name: "Niger",
      dial_code: "227",
      code: "NE"
    }, {
      name: "Nigeria",
      dial_code: "234",
      code: "NG"
    }, {
      name: "Niue",
      dial_code: "683",
      code: "NU"
    }, {
      name: "Norfolk Island",
      dial_code: "672",
      code: "NF"
    }, {
      name: "Northern Mariana Islands",
      dial_code: "1 670",
      code: "MP"
    }, {
      name: "Norway",
      dial_code: "47",
      code: "NO"
    }, {
      name: "Oman",
      dial_code: "968",
      code: "OM"
    }, {
      name: "Pakistan",
      dial_code: "92",
      code: "PK"
    }, {
      name: "Palau",
      dial_code: "680",
      code: "PW"
    }, {
      name: "Panama",
      dial_code: "507",
      code: "PA"
    }, {
      name: "Papua New Guinea",
      dial_code: "675",
      code: "PG"
    }, {
      name: "Paraguay",
      dial_code: "595",
      code: "PY"
    }, {
      name: "Peru",
      dial_code: "51",
      code: "PE"
    }, {
      name: "Philippines",
      dial_code: "63",
      code: "PH"
    }, {
      name: "Poland",
      dial_code: "48",
      code: "PL"
    }, {
      name: "Portugal",
      dial_code: "351",
      code: "PT"
    }, {
      name: "Puerto Rico",
      dial_code: "1 939",
      code: "PR"
    }, {
      name: "Qatar",
      dial_code: "974",
      code: "QA"
    }, {
      name: "Romania",
      dial_code: "40",
      code: "RO"
    }, {
      name: "Rwanda",
      dial_code: "250",
      code: "RW"
    }, {
      name: "Samoa",
      dial_code: "685",
      code: "WS"
    }, {
      name: "San Marino",
      dial_code: "378",
      code: "SM"
    }, {
      name: "Saudi Arabia",
      dial_code: "966",
      code: "SA"
    }, {
      name: "Senegal",
      dial_code: "221",
      code: "SN"
    }, {
      name: "Serbia",
      dial_code: "381",
      code: "RS"
    }, {
      name: "Seychelles",
      dial_code: "248",
      code: "SC"
    }, {
      name: "Sierra Leone",
      dial_code: "232",
      code: "SL"
    }, {
      name: "Singapore",
      dial_code: "65",
      code: "SG"
    }, {
      name: "Slovakia",
      dial_code: "421",
      code: "SK"
    }, {
      name: "Slovenia",
      dial_code: "386",
      code: "SI"
    }, {
      name: "Solomon Islands",
      dial_code: "677",
      code: "SB"
    }, {
      name: "South Africa",
      dial_code: "27",
      code: "ZA"
    }, {
      name: "South Georgia and the South Sandwich Islands",
      dial_code: "500",
      code: "GS"
    }, {
      name: "Spain",
      dial_code: "34",
      code: "ES"
    }, {
      name: "Sri Lanka",
      dial_code: "94",
      code: "LK"
    }, {
      name: "Sudan",
      dial_code: "249",
      code: "SD"
    }, {
      name: "Suriname",
      dial_code: "597",
      code: "SR"
    }, {
      name: "Swaziland",
      dial_code: "268",
      code: "SZ"
    }, {
      name: "Sweden",
      dial_code: "46",
      code: "SE"
    }, {
      name: "Switzerland",
      dial_code: "41",
      code: "CH"
    }, {
      name: "Tajikistan",
      dial_code: "992",
      code: "TJ"
    }, {
      name: "Thailand",
      dial_code: "66",
      code: "TH"
    }, {
      name: "Togo",
      dial_code: "228",
      code: "TG"
    }, {
      name: "Tokelau",
      dial_code: "690",
      code: "TK"
    }, {
      name: "Tonga",
      dial_code: "676",
      code: "TO"
    }, {
      name: "Trinidad and Tobago",
      dial_code: "1 868",
      code: "TT"
    }, {
      name: "Tunisia",
      dial_code: "216",
      code: "TN"
    }, {
      name: "Turkey",
      dial_code: "90",
      code: "TR"
    }, {
      name: "Turkmenistan",
      dial_code: "993",
      code: "TM"
    }, {
      name: "Turks and Caicos Islands",
      dial_code: "1 649",
      code: "TC"
    }, {
      name: "Tuvalu",
      dial_code: "688",
      code: "TV"
    }, {
      name: "Uganda",
      dial_code: "256",
      code: "UG"
    }, {
      name: "Ukraine",
      dial_code: "380",
      code: "UA"
    }, {
      name: "United Arab Emirates",
      dial_code: "971",
      code: "AE"
    }, {
      name: "United Kingdom",
      dial_code: "44",
      code: "GB"
    }, {
      name: "Uruguay",
      dial_code: "598",
      code: "UY"
    }, {
      name: "Uzbekistan",
      dial_code: "998",
      code: "UZ"
    }, {
      name: "Vanuatu",
      dial_code: "678",
      code: "VU"
    }, {
      name: "Wallis and Futuna",
      dial_code: "681",
      code: "WF"
    }, {
      name: "Yemen",
      dial_code: "967",
      code: "YE"
    }, {
      name: "Zambia",
      dial_code: "260",
      code: "ZM"
    }, {
      name: "Zimbabwe",
      dial_code: "263",
      code: "ZW"
    }, {
      name: "land Islands",
      dial_code: "null",
      code: "AX"
    }, {
      name: "Antarctica",
      dial_code: "null",
      code: "AQ"
    }, {
      name: "Bolivia, Plurinational State of",
      dial_code: "591",
      code: "BO"
    }, {
      name: "Brunei Darussalam",
      dial_code: "673",
      code: "BN"
    }, {
      name: "Cocos (Keeling) Islands",
      dial_code: "61",
      code: "CC"
    }, {
      name: "Congo, The Democratic Republic of the",
      dial_code: "243",
      code: "CD"
    }, {
      name: "Cote d'Ivoire",
      dial_code: "225",
      code: "CI"
    }, {
      name: "Falkland Islands (Malvinas)",
      dial_code: "500",
      code: "FK"
    }, {
      name: "Guernsey",
      dial_code: "44",
      code: "GG"
    }, {
      name: "Holy See (Vatican City State)",
      dial_code: "379",
      code: "VA"
    }, {
      name: "Hong Kong",
      dial_code: "852",
      code: "HK"
    }, {
      name: "Iran, Islamic Republic of",
      dial_code: "98",
      code: "IR"
    }, {
      name: "Isle of Man",
      dial_code: "44",
      code: "IM"
    }, {
      name: "Jersey",
      dial_code: "44",
      code: "JE"
    }, {
      name: "Korea, Democratic People's Republic of",
      dial_code: "850",
      code: "KP"
    }, {
      name: "Korea, Republic of",
      dial_code: "82",
      code: "KR"
    }, {
      name: "Lao People's Democratic Republic",
      dial_code: "856",
      code: "LA"
    }, {
      name: "Libyan Arab Jamahiriya",
      dial_code: "218",
      code: "LY"
    }, {
      name: "Macao",
      dial_code: "853",
      code: "MO"
    }, {
      name: "Macedonia, The Former Yugoslav Republic of",
      dial_code: "389",
      code: "MK"
    }, {
      name: "Micronesia, Federated States of",
      dial_code: "691",
      code: "FM"
    }, {
      name: "Moldova, Republic of",
      dial_code: "373",
      code: "MD"
    }, {
      name: "Mozambique",
      dial_code: "258",
      code: "MZ"
    }, {
      name: "Palestinian Territory, Occupied",
      dial_code: "970",
      code: "PS"
    }, {
      name: "Pitcairn",
      dial_code: "872",
      code: "PN"
    }, {
      name: "Réunion",
      dial_code: "262",
      code: "RE"
    }, {
      name: "Russia",
      dial_code: "7",
      code: "RU"
    }, {
      name: "Saint Barthélemy",
      dial_code: "590",
      code: "BL"
    }, {
      name: "Saint Helena, Ascension and Tristan Da Cunha",
      dial_code: "290",
      code: "SH"
    }, {
      name: "Saint Kitts and Nevis",
      dial_code: "1 869",
      code: "KN"
    }, {
      name: "Saint Lucia",
      dial_code: "1 758",
      code: "LC"
    }, {
      name: "Saint Martin",
      dial_code: "590",
      code: "MF"
    }, {
      name: "Saint Pierre and Miquelon",
      dial_code: "508",
      code: "PM"
    }, {
      name: "Saint Vincent and the Grenadines",
      dial_code: "1 784",
      code: "VC"
    }, {
      name: "Sao Tome and Principe",
      dial_code: "239",
      code: "ST"
    }, {
      name: "Somalia",
      dial_code: "252",
      code: "SO"
    }, {
      name: "Svalbard and Jan Mayen",
      dial_code: "47",
      code: "SJ"
    }, {
      name: "Syrian Arab Republic",
      dial_code: "963",
      code: "SY"
    }, {
      name: "Taiwan, Province of China",
      dial_code: "886",
      code: "TW"
    }, {
      name: "Tanzania, United Republic of",
      dial_code: "255",
      code: "TZ"
    }, {
      name: "Timor-Leste",
      dial_code: "670",
      code: "TL"
    }, {
      name: "Venezuela, Bolivarian Republic of",
      dial_code: "58",
      code: "VE"
    }, {
      name: "Viet Nam",
      dial_code: "84",
      code: "VN"
    }, {
      name: "Virgin Islands, British",
      dial_code: "1 284",
      code: "VG"
    }, {
      name: "Virgin Islands, U.S.",
      dial_code: "1 340",
      code: "VI"
    }]
  }

}

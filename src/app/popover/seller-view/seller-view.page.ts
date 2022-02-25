import { Component, OnInit, Input } from '@angular/core';
import { ProviderService } from '../../providers/provider.service';
import { NavigationExtras } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-seller-view',
  templateUrl: './seller-view.page.html',
  styleUrls: ['./seller-view.page.scss'],
})
export class SellerViewPage implements OnInit {
  @Input() id: string;

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
  constructor(public provider: ProviderService,
    public navy: NavController,
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let body = {
      seller_id: this.id
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
      //  console.log(rat)
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

  check_store(id) {
    let options: NavigationExtras = {
      queryParams: {
        shop_id: id
      }

    }
    this.popoverController.dismiss(
      'store'
    );

    this.navy.navigateForward(['shop'], options);
  }



}

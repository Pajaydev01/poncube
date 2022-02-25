import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  url: any;
  constructor(
    //  private http: HTTP,
    public ht: Http,
  ) {
    this.url = "https://api.poncube.com/api/";
  }

  products() {
    let body = {
      name: ""
    }
    return this.ht.get(this.url + 'products.php').pipe(map(res => res.json()))
      ;
  }

  //get all products here
  get_product(id, shop_id) {
    let body = {
      item_id: id,
      shop_id: shop_id
    }

    return this.ht.post(this.url + 'get_product.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  get_category(body) {
    return this.ht.post(this.url + 'get_category.php', JSON.stringify(body)).pipe(map(res => res.json()))
      ;
  }

  //get all categories here
  categoriesAll() {
    let body = {

    }
    return this.ht.post(this.url + 'category.php', JSON.stringify(body)).pipe(map(res => res.json()))
      ;
  }

  //user registers here
  register(firstname, lastname, email, phone, password, newsletter, address, type) {
    let body = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      password: password,
      newsletter: newsletter,
      address: address,
      type: type
    }

    return this.ht.post(this.url + 'register.php', JSON.stringify(body)).pipe(map(res => res.json()))
      ;
  }

  register_fb(firstname, lastname, email, password, type) {
    let body = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      type: type
    }

    return this.ht.post(this.url + 'register.php', JSON.stringify(body)).pipe(map(res => res.json()))
      ;
  }

  //get user profile here
  get_profile(session_id) {
    let body = {
      session_id: session_id
    }
    return this.ht.post(this.url + 'get_profile.php', JSON.stringify(body)).pipe(map(res => res.json()))
      ;
  }

  //logoout
  logout(session_id) {
    let body = {
      session_id: session_id
    }
    return this.ht.post(this.url + 'logout.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //login here
  login(login, pass, type) {
    let body = {
      login_param: login,
      password: pass,
      type: type
    }
    return this.ht.post(this.url + 'login.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //turn user to seller here
  turn_seller(body) {
    return this.ht.post(this.url + 'create_store.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //get seller's uploaded items here
  get_seller_product(id) {
    let body = {
      session_id: id
    }
    return this.ht.post(this.url + 'get_seller_product.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //load shop poroduct here
  get_seller_products(body) {
    return this.ht.post(this.url + 'get_store_products.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //upload the products here
  uploader(body) {
    return this.ht.post(this.url + 'add_item.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //uploade edited product here
  //upload the products here
  edited(body) {
    return this.ht.post(this.url + 'edit_item.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //delete item here
  delete(body) {
    return this.ht.post(this.url + 'delete_product.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //get seller's profile
  get_seller_profile(body) {
    return this.ht.post(this.url + 'get_seller_profile.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //add money to wallet
  add_money(body) {
    return this.ht.post(this.url + 'wallet_mgt.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //get token
  get_token(body) {
    return this.ht.post(this.url + 'get_token.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //make purchase
  purchase(body) {
    return this.ht.post(this.url + 'purchase.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //get order list for buyer
  get_orders(body) {
    return this.ht.post(this.url + 'get_orders.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //cancel orders here
  cancel(body) {
    return this.ht.post(this.url + 'cancel.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //cancel orders here
  accept(body) {
    return this.ht.post(this.url + 'accept.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //CONFIRM PURCHASE
  confirm(body) {
    return this.ht.post(this.url + 'confirm_delivery.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  //get_seller
  get_seller(body) {
    return this.ht.post(this.url + 'get_seller.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }
  favorite(body) {
    return this.ht.post(this.url + 'favorite.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }
  change_dp(body) {
    return this.ht.post(this.url + 'change_dp.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  dispute(body) {
    return this.ht.post(this.url + 'dispute.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  edit_store(body) {
    return this.ht.post(this.url + 'edit_store.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  add_comm(body) {
    return this.ht.post(this.url + 'add_comment.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  get_comm(body) {
    return this.ht.post(this.url + 'get_comment.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  withdraw_money(body) {
    return this.ht.post(this.url + 'withdraw_money.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  save_bank(body) {
    return this.ht.post(this.url + 'save_bank.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  reset(body) {
    return this.ht.post(this.url + 'password_reset.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  sendText(body) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'App f86bf4e31fa4c2a5a7730fb9b63455e6-2c9eee48-1c01-4042-892a-c4ec15d64db0',
      Accept: 'application/json',

    });

    return this.ht.post('https://19r3kd.api.infobip.com/sms/2/text/single', JSON.stringify(body), { headers }).pipe(map(res => res.json()));
  }

  update_ship(body) {
    return this.ht.post(this.url + 'update_ship.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  transfer(body) {
    return this.ht.post(this.url + 'transfer.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  send_money(body) {
    return this.ht.post(this.url + 'send_money.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }
  promo(body) {
    return this.ht.post(this.url + 'promo.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }
  get_exchange() {
    return this.ht.get(this.url + 'exchange_rate.php').pipe(map(res => res.json()));
  }
  edit_profile(body) {
    return this.ht.post(this.url + 'edit_profile.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  change_token(body) {
    return this.ht.post(this.url + 'change_token.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  get_transactions(body) {
    return this.ht.post(this.url + 'get_transactions.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  loggin_check(body) {
    return this.ht.post(this.url + 'login_check.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  cancel_log(body) {
    return this.ht.post(this.url + 'cancel_log.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  rate_shop(body) {
    return this.ht.post(this.url + 'rate_shop.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }

  get_address(body) {
    return this.ht.post(this.url + 'get_orders.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }
  save_delivery(body) {
    return this.ht.post(this.url + 'seller_delivery.php', JSON.stringify(body)).pipe(map(res => res.json()));
  }
  //check for available update
  updateApp() {
    return this.ht.get(this.url + 'check_update.php').pipe(map(res => res.json()));
  }

}

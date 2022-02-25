import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../providers/provider.service';
import { LoadingController, ModalController, IonInfiniteScroll, IonContent, NavController, ToastController, AlertController, Platform } from '@ionic/angular';
import { WelcomePage } from '../../guides/sellers/welcome/welcome.page';
import { PopoverController } from '@ionic/angular';
import { GuidesPage } from '../../popover/guides/guides.page';
declare var require: any;
//import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-seller-items',
  templateUrl: './seller-items.page.html',
  styleUrls: ['./seller-items.page.scss'],
})
export class SellerItemsPage implements OnInit {
  categories: any;
  sub_category: any;
  sub_sub_category: any;
  items: any;
  new_items: any;
  product_lists: any;
  empty: boolean;
  res: any;
  data: boolean = false;
  item: boolean;
  add_product: boolean;
  add_service: boolean;
  formData: any;
  img_res: any;
  disp: any = [];
  isLoading: boolean;
  product_full: boolean;
  arrow: boolean = true;
  nam: any = 'name';
  item_edit: any;

  edit_product: boolean = false;
  edit_service: boolean = false;
  edited_items: any;
  edited_items_products: any;
  item_id: any;

  //form inputs  here for products
  name: any = "";
  total: any = "";
  delivery: any = "";
  price: any = "";
  description: any = "";
  cate: any;
  sub_cate: any;
  sub_sub_cate: any = "";
  category: any;
  options: any = [];
  opts_datas: any = [];
  resp: any;
  service_full: boolean = false;

  //form inputs here for service
  s_name: any = "";
  s_delivery: any = "";
  s_price: any = "";
  s_cate: any;
  s_sub_cate: any;
  s_description: any = "";

  //shipping DETAILS
  shipping_details: any;
  shiper: any;
  ship_edit: any;
  //images here
  images: any = [];

  //delivery here
  deliveries: any = [];

  //shipping options here
  shipping_options: any;
  ship: any = false;

  res_p: any;
  promo: boolean;

  new_list: any = [];

  //delivery
  res_d: any;
  reso: any;

  constructor(public provider: ProviderService,
    public loadingController: LoadingController, public navy: NavController, public toastController: ToastController, public alertController: AlertController, public modalController: ModalController, public popoverController: PopoverController,
    // private camera: Camera,
    public platform: Platform) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    //console.log(this.cate)
    this.loader();
  }

  async loadguide() {
    // import IntroJS
    const IntroJs = require("../../../../node_modules/intro.js/intro");
    let intro = new IntroJs();
    //  console.log("inside intro.js");
    intro.setOptions({
      steps: [
        {
          intro: "Now, let's walk you through what each of this button does"
        },
        {
          element: "#adds",
          intro:
            "To add a product or service, please click on  'Add item' and select one of the two available options",
          position: "right"
        }
      ],
      showProgress: false,
      skipLabel: "Skip",
      doneLabel: "Done",
      nextLabel: "Next",
      prevLabel: "Previous",
      overlayOpacity: "0.8"
    });
    intro.start();
  }
  //load the first instance of data here
  loader() {
    let session_id = localStorage.getItem('session_id');
    //fetch items from data base
    this.provider.get_seller_product(session_id).subscribe(res => {
      this.res = res;
      this.data = true;

      if (this.res.message !== "success") {
        this.empty = true;
        this.item = true;
        this.categories = this.res.category;
        this.sub_category = this.res.sub_category;
        this.sub_sub_category = this.res.sub_sub_category;
        //console.log(this.res)
        (localStorage.getItem('useGuide') === "off" || localStorage.getItem('useGuide') === null) ? this.loadguide() : "";

      }
      else {
        this.empty = false;
        this.product_lists = this.res.products;
        this.items = this.res.items;
        this.categories = this.res.category;
        this.item = true;
        this.sub_category = this.res.sub_category;
        this.sub_sub_category = this.res.sub_sub_category;
        this.shipping_details = this.res.shipping_details;
        //console.log(this.res)
        (localStorage.getItem('useGuide') === "off" || localStorage.getItem('useGuide') === null) ? this.loadguide() : "";

      }
    }, err => {
      this.presentToast('Sorry, an error occured, please try again');

    })
  }


  //test camera upload here
  async upload() {
    //direct to upload place
    //first ask if the person is uploading a product or a service
    let body = {
      session_id: localStorage.getItem('session_id'),
      type: 'fetch'
    }
    this.provider.save_delivery(body).subscribe(res => {
      this.reso = res;
      if (this.reso.message === "success") {
        this.deliveries = this.reso.delivery;
      }
      else {
        console.log(this.reso.message);
      }
    }, err => {
      console.log(err);
      this.presentToast('AN error occured');
    })

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Please Choose',
      message: '<strong>Is this a product to Sell or a Service to render</strong>',
      buttons: [
        {
          text: 'Product',
          cssClass: 'secondary',
          handler: () => {
            //show product div
            this.category = "products";
            this.item = false;
            this.add_product = true;

          }
        }, {
          text: 'Service',
          handler: () => {
            this.category = "service";
            this.item = false;
            this.add_service = true;
          }
        }
      ]
    });

    await alert.present();
  }


  //add colors
  async add_options() {
    if (this.options.length === 5) {
      this.presentToast('Sorry, you can only add five options')
    }
    else {

      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Option name',
        inputs: [
          {
            name: 'option',
            type: 'text',
            placeholder: 'e.g colors, sizes'
          }],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              //console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Add',
            handler: (data) => {
              //console.log(data.option)
              if (data.option === "") {
                this.presentToast('Please enter a valid input');
                return false;
              }
              else {
                this.add_opt_details(data.option, 'name');
              }
            }
          }
        ]
      });

      await alert.present();
    }
  }


  //add colors
  async add_opt_details(res, name) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Add ' + res,
      inputs: [
        {
          name: 'values',
          type: 'text',
          placeholder: 'Enter ' + res,
          id: "values"
        }],
      buttons: [
        {
          text: 'Add More',
          handler: (data) => {
            if (data.values === "") {
              this.presentToast('Please fill the field');
              return false;
            }
            else {
              this.opts_datas.push(data.values);
              this.presentToast('Parameter added, you can enter another and keep add, click save when ');
              alert.inputs = [{ name: 'values', value: [] }]
              return false;
            }
          }
        },
        {
          text: 'Save',
          handler: () => {
            if (this.opts_datas.length === 0) {
              this.presentToast('Save at least an input');
              return false;
            }
            else {
              let body = {
                [res]: this.opts_datas,
                [name]: res
              }
              this.options.push(body);
              console.log(this.options)
              this.opts_datas = [];
              this.presentToast('Data saved');
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }
      ]
    });
    await alert.present();
    (localStorage.getItem('useGuide') === "off" || localStorage.getItem('useGuide') === null) ? this.guide() : "";

  }

  //load guide for input here
  async guide() {
    const popover = await this.popoverController.create({
      component: GuidesPage,
      cssClass: 'pop-class',
      translucent: true,
      showBackdrop: true,
      componentProps: {

      }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();

  }

  //add develiery options here
  //add colors
  async delivery_service() {
    if (this.options.length === 5) {
      this.presentToast('Sorry, you can only add five options')
    }
    else {

      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Add other available deliveries here, do not add shipping here',
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: 'E.g: dhl or logistic services'
          },
          {
            name: 'price',
            type: 'number',
            placeholder: 'Price (enter zero for free delivery)'
          },
        ],
        buttons: [
          {
            text: 'Add More',
            handler: (data) => {
              if (data.name === "" || data.price === "") {
                this.presentToast("Please enter a value");
                return false;
              }
              else {
                //console.log(data.option)
                let body = {
                  name: data.name,
                  price: data.price
                }
                this.deliveries.push(body);
                //console.log(this.deliveries)
                alert.inputs = [{ name: 'name', value: [] }, { name: 'price', value: [] }
                ]
                return false
              }
            }
          },
          {
            text: 'Save',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              //ask to save online or not
              this.save_delivery();
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
      (localStorage.getItem('useGuide') === "off" || localStorage.getItem('useGuide') === null) ? this.guide() : "";

    }
  }


  //handle saving delivery here
  async save_delivery() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Save to your delivery items',
      message: 'Will always be automatically loaded, you will not have to retype',
      buttons: [
        {
          text: 'Proceed',
          handler: () => {
            let body = {
              session_id: localStorage.getItem('session_id'),
              delivery: this.deliveries,
              type: 'save'
            }
            //  console.log(body);
            this.loadingPresent('Saving, please wait...');
            this.provider.save_delivery(body).subscribe(res => {
              this.res_d = res;
              if (this.res_d.message === "success") {
                this.loadingDismiss();
                this.presentToast('Saved');
              }
              else {
                this.loadingDismiss();
                this.presentToast(this.res_d.message);
                console.log(this.res_d);
              }
            }, err => {
              this.loadingDismiss();
              this.presentToast(err);
              console.log(err);
            })
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.ship = false;
          }
        }
      ]
    });

    await alert.present();

  }

  //create shipping option here
  async shipping() {
    //console.log(this.ship)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'FIll IN SHIPPING DETAILS',
      inputs: [
        {
          name: 'sku',
          type: 'text',
          placeholder: 'Stock Keeping Unit'
        },
        {
          name: 'upc',
          type: 'text',
          placeholder: 'Universal product code'
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'shipping price'
        }
      ],
      buttons: [
        {
          text: 'Save',
          handler: (data) => {
            if (data.sku === "" || data.upc === "" || data.upc === "") {
              this.presentToast("Please fill all fields ");
              return false;
            }
            else {
              //console.log(data.option)
              let body = {
                sku: data.sku,
                upc: data.upc,
                price: data.price
              }

              let body_2 = {
                name: "Shipping",
                price: data.price
              }
              this.deliveries.push(body_2);
              this.shipping_options = body;
              this.ship = true;
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
            this.ship = false;
          }
        }
      ]
    });

    await alert.present();

  }


  //dun discount sales here
  async discount() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Add discount',
      message: '<i>The first date field if the start date, while the second is the discount end date</i>',
      inputs: [
        {
          name: 'start_date',
          type: 'date',
          label: 'Start date',
          //   min: '2017-03-01',
          max: '2022-01-12',
          placeholder: 'Start date'
        },
        {
          name: 'end_date',
          type: 'date',
          label: 'End date',
          max: '2022-05-12'
        },
        {
          name: 'price',
          type: 'number',

          placeholder: 'Discount price'
        },
        {
          name: 'name',
          type: 'text',
          placeholder: 'Offer Name'
        },
        {
          name: 'percent',
          type: 'text',
          placeholder: 'Enter percent e.g 20%'
        }
      ],
      buttons: [
        {
          text: 'Save',
          handler: (data) => {
            if (data.price === "" || data.name === "" || data.percent === "") {
              this.presentToast("Please fill all fields ");
              return false;
            }
            else {
              this.loadingPresent("Adding promo, please wait...");
              //console.log(data.option)
              let body = {
                name: data.name,
                percent: data.percent,
                price: data.price,
                start_date: data.start_date,
                end_date: data.end_date,
                session_id: localStorage.getItem('session_id'),
                type: 'create',
                item_id: this.item_id
              }

              //ping server
              this.provider.promo(body).subscribe(res => {
                this.res_p = res;
                if (this.res_p.message === "success") {
                  this.promo = true;
                  this.loadingDismiss();
                  this.presentToast("You have successfully created a discount sales for this product");
                }
                else {
                  this.loadingDismiss();
                  this.presentToast(this.res_p.message);
                  console.log(this.res_p.message);
                }
              }, err => {
                this.loadingDismiss();
                console.log(err);
                this.presentToast(err)
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

  async cancel_discount() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Remove discount',
      message: '<i>Please confirm you really want to remove discount</i>',
      buttons: [
        {
          text: 'Proceed',
          handler: () => {
            this.loadingPresent("Removing please wait...");
            let body = {
              item_id: this.item_id,
              session_id: localStorage.getItem('session_id'),
              type: 'delete'
            }

            this.provider.promo(body).subscribe(res => {
              this.res_p = res;

              if (this.res_p.message === "success") {
                this.promo = false;
                this.loadingDismiss();
                this.presentToast("Discount successfully deleted");
              }
              else {
                this.loadingDismiss();
                this.presentToast(this.res_p.message);
                console.log(this.res_p.message);
              }
            }, err => {
              this.loadingDismiss();
              console.log(err);
              this.presentToast(err)
            })
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

  //upload the product here
  uploader() {
    let session_id = localStorage.getItem('session_id');
    if (this.name === "" || this.total === "" || this.description === "" || this.price === "" || this.deliveries.lenght === 0 || this.options.length === 0) {
      this.presentToast('Sorry, all input fields are compulsory')
    }
    else {
      //check that image array is not empty
      if (this.images.length !== 0) {
        let body = (this.shipping_options === undefined) ? {
          name: this.name,
          total: this.total,
          description: this.description,
          price: this.price,
          options: this.options,
          delivery: this.deliveries,
          images: this.images,
          category: this.category,
          category_id: this.cate,
          sub_category_id: this.sub_cate,
          sub_sub_category_id: this.sub_sub_cate,
          session_id: session_id,
          sku: "",
          upc: "",
        } : {
          name: this.name,
          total: this.total,
          description: this.description,
          price: this.price,
          options: this.options,
          delivery: this.deliveries,
          images: this.images,
          category: this.category,
          category_id: this.cate,
          sub_category_id: this.sub_cate,
          sub_sub_category_id: this.sub_sub_cate,

          sku: this.shipping_options.sku,
          upc: this.shipping_options.upc,
          session_id: session_id
        }
        this.loadingPresent('Saving product data, please wait...');
        this.provider.uploader(body).subscribe(res => {
          this.resp = res;
          if (this.resp.message === "success") {
            this.loadingDismiss();
            this.presentToast('Congratulations!, your product was successfully uploaded');
            this.dismiss();
          }
          else {
            this.loadingDismiss();
            this.presentToast(this.resp.message);
            console.log(this.resp.message);
          }
        }, err => {
          this.loadingDismiss();
          console.log(err);
          this.presentToast('Sorry, an error occured');
        })
      }
      else {
        this.presentToast("You must upload at least one image of your product");
      }
    }
  }


  //upload the serivice here
  uploader_s() {
    let session_id = localStorage.getItem('session_id');
    if (this.s_name === "" || this.s_description === "" || this.s_price === "" || this.s_delivery === "") {
      this.presentToast('Sorry, all input fields are compulsory')
    }
    else {
      //check that image array is not empty
      if (this.images.length !== 0) {
        let body = (this.shipping_options !== undefined) ? {
          name: this.s_name,
          description: this.s_description,
          price: this.s_price,
          delivery_time: this.s_delivery,
          images: this.images,
          category: this.category,
          category_id: this.s_cate,
          sub_category_id: this.s_sub_cate,
          session_id: session_id,
          delivery: this.deliveries,

          //shipping
          sku: this.shipping_options.sku,
          upc: this.shipping_options.upc,
        } : {
          name: this.s_name,
          description: this.s_description,
          price: this.s_price,
          delivery_time: this.s_delivery,
          images: this.images,
          category: this.category,
          category_id: this.s_cate,
          sub_category_id: this.s_sub_cate,
          session_id: session_id,
          delivery: this.deliveries,

          //shipping
          sku: "",
          upc: "",
        }
        this.loadingPresent('Saving service data, please wait.');
        this.provider.uploader(body).subscribe(res => {
          this.resp = res;
          if (this.resp.message === "success") {
            this.loadingDismiss();
            this.presentToast('Congratulations!, your service was successfully uploaded');
            this.dismiss();
          }
          else {
            this.loadingDismiss();
            this.presentToast(this.resp.message);
            console.log(this.resp.message);
          }
        }, err => {
          this.loadingDismiss();
          console.log(err);
          this.presentToast('Sorry, an error occured');
        })
      }
      else {
        this.presentToast("You must upload at least one image of your product");
      }
    }
  }


  //add image
  add_image($event) {
    if (this.images.length === 8) {
      this.presentToast('Sorry, you can not have more than 8 images');
    }
    else {
      let file = $event.target.files[0];
      const data = new FileReader();
      data.readAsDataURL(file);
      data.onload = (dataReader) => {
        this.formData = dataReader;

        let image_data = (this.formData.target.result.substr(0, 22) === "data:image/png;base64,") ? this.formData.target.result.replace("data:image/png;base64,", "") : this.formData.target.result.replace("data:image/jpeg;base64,", "");

        this.images.push(image_data);
        this.disp.push(this.formData.target.result);
        this.presentToast('Image saved, you can another image of your Item');
      }
    }
  }
  //delete items here
  remove(image) {
    this.disp.splice(image, 1);
    this.images.splice(image, 1);
  }
  //remove item category
  remove_cat(i) {
    this.deliveries.splice(i, 1);
  }
  //remove item options
  remove_options(i) {
    this.options.splice(i, 1)
  }

  //items full details here
  details(id, i) {
    //fetch saved deliveries here


    this.new_list = [];
    this.new_list.push(this.product_lists[i]);
    //  console.log(this.new_list)
    this.item = false;
    this.arrow = false;
    const new_item = this.items.filter(res => res.item_id == parseInt(id));
    //console.log(this.shipping_details)
    const new_ship = (this.shipping_details !== null) ? this.shipping_details.filter(res => res.item_id == parseInt(id)) : "";
    this.new_items = new_item;
    this.shiper = new_ship;
    (this.new_items[0].category === "product") ? this.product_full = true : this.service_full = true;
    //console.log(this.shiper)
  }

  edit(id, category, promo) {
    let items = this.items;
    this.promo = (promo == "1") ? true : false;
    //console.log(promo)

    if (category === "product") {
      let new_item = this.items.filter(res => res.item_id == parseInt(id));
      let new_shipping = (this.shipping_details !== null) ? this.shipping_details.filter(res => res.item_id == parseInt(id)) : "";
      this.ship_edit = new_shipping;
      this.edited_items_products = items.filter(res => res.item_id !== parseInt(id));
      this.item_edit = new_item;
      this.edit_product = true;
      this.arrow = false;
      this.item = false;
      this.name = this.item_edit[0].name;
      this.total = this.item_edit[0].total;
      this.deliveries = this.item_edit[0].delivery;
      this.price = this.item_edit[0].price;
      this.description = this.item_edit[0].description;
      this.options = this.item_edit[0].options;
      this.item_id = this.item_edit[0].item_id;
      this.shipping_options = (this.ship_edit.length !== 0) ? {
        sku: this.ship_edit[0].sku,
        upc: this.ship_edit[0].upc
      } : undefined;
      // console.log(this.shipping_options)
    }
    else {
      let new_item = this.items.filter(res => res.item_id == parseInt(id));
      this.edited_items = items.filter(res => res.item_id !== parseInt(id));

      let new_shipping = this.shipping_details.filter(res => res.item_id == parseInt(id));
      this.ship_edit = new_shipping;
      //console.log(new_item)
      this.item_edit = new_item;
      this.edit_service = true;
      this.arrow = false;
      this.item = false;
      this.s_name = this.item_edit[0].name;
      this.s_delivery = this.item_edit[0].delivery_time;
      this.deliveries = this.item_edit[0].delivery;
      this.s_price = this.item_edit[0].price;
      this.s_description = this.item_edit[0].description;
      this.item_id = this.item_edit[0].item_id;
      this.shipping_options = (this.ship_edit.length !== 0) ? {
        sku: this.ship_edit[0].sku,
        upc: this.ship_edit[0].upc
      } : undefined;
      //  console.log(this.shipping_options)
      //console.log(this.edited_items)
    }
    // this.new_items=new_item;
    // (this.new_items.category==="product")?this.product_full=true:this.service_full=true;
  }

  //upload edited product
  upload_product_edit() {
    let session_id = localStorage.getItem('session_id');
    if (this.name === "" || this.total === "" || this.description === "" || this.price === "" || this.deliveries.lenght === 0 || this.options.length === 0) {
      this.presentToast('Sorry, all input fields are compulsory')
    }
    else {
      //check that image array is not empty
      if (this.images.length !== 0) {
        let body = (this.shipping_options !== undefined) ? {
          name: this.name,
          total: this.total,
          description: this.description,
          price: this.price,
          options: this.options,
          delivery: this.deliveries,
          images: this.images,
          category: 'products',
          category_id: this.cate,
          session_id: session_id,
          item_id: this.item_id,
          sub_category_id: this.sub_cate,
          sub_sub_category_id: this.sub_sub_cate,

          sku: this.shipping_options.sku,
          upc: this.shipping_options.upc,
          edited_item: this.edited_items_products
        } : {
          name: this.name,
          total: this.total,
          description: this.description,
          price: this.price,
          options: this.options,
          delivery: this.deliveries,
          images: this.images,
          category: 'products',
          category_id: this.cate,
          session_id: session_id,
          item_id: this.item_id,
          sub_category_id: this.sub_cate,
          sub_sub_category_id: this.sub_sub_cate,

          sku: "",
          upc: "",
          edited_item: this.edited_items_products
        }
        this.loadingPresent('Uploading edited data...');
        this.provider.edited(body).subscribe(res => {
          this.resp = res;
          console.log(this.resp.message)
          if (this.resp.message === "success") {
            this.loadingDismiss();
            this.presentToast('Congratulations!, your product was successfully uploaded');
            this.dismiss();
          }
          else {
            this.loadingDismiss();
            this.presentToast(this.resp.message);
            console.log(this.resp.message);
          }
        }, err => {
          this.loadingDismiss();
          console.log(err);
          this.presentToast('Sorry, an error occured');
        })
      }
      else {
        this.presentToast("You must upload at least one image of your product");
      }
    }
  }

  //submite edited item here
  uploader_edit_service() {
    let session_id = localStorage.getItem('session_id');
    if (this.s_name === "" || this.s_description === "" || this.s_price === "" || this.s_delivery === "") {
      this.presentToast('Sorry, all input fields are compulsory')
    }
    else {
      //check that image array is not empty
      if (this.images.length !== 0) {
        let body = (this.shipping_options !== undefined) ? {
          name: this.s_name,
          description: this.s_description,
          price: this.s_price,
          delivery_time: this.s_delivery,
          images: this.images,
          category: 'service',
          category_id: this.s_cate,
          sub_category_id: this.s_sub_cate,
          session_id: session_id,
          delivery: this.deliveries,
          item_id: this.item_id,

          sku: this.shipping_options.sku,
          upc: this.shipping_options.upc,
          edited_item: this.edited_items
        } : {
          name: this.s_name,
          description: this.s_description,
          price: this.s_price,
          delivery_time: this.s_delivery,
          images: this.images,
          category: 'service',
          category_id: this.s_cate,
          sub_category_id: this.s_sub_cate,
          session_id: session_id,
          delivery: this.deliveries,
          item_id: this.item_id,

          sku: "",
          upc: "",
          edited_item: this.edited_items
        }
        //console.log(body);


        this.loadingPresent('Uploading edited data...');
        this.provider.edited(body).subscribe(res => {
          this.resp = res;
          if (this.resp.message === "success") {
            this.loadingDismiss();
            this.presentToast('Congratulations!, your service was successfully uploaded');
            this.dismiss();
          }
          else {
            this.loadingDismiss();
            this.presentToast(this.resp.message);
            console.log(this.resp.message);
          }
        }, err => {
          this.loadingDismiss();
          console.log(err);
          this.presentToast('Sorry, an error occured');
        })
      }
      else {
        this.presentToast("You must upload at least one image of your product");
      }
    }
  }


  async confirm_delete(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'ARE YOU SURE YOU WANT TO REMOVE THIS ITEM?',
      buttons: [
        {
          text: 'Proceed',
          handler: () => {
            this.delete(id);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();

  }

  //delete item from array here and return back to db  for saving
  delete(id) {
    let session_id = localStorage.getItem('session_id');
    const new_items = this.items.filter(res => res.item_id !== parseInt(id));
    //  console.log(new_items);

    let body = {
      item_id: id,
      items: new_items,
      session_id: session_id
    }

    this.provider.delete(body).subscribe(res => {
      this.res = res;
      console.log(this.res);
      if (this.res.message === "success") {
        this.arrow = true;
        this.presentToast('Item successfully deleted');
        this.data = false;
        this.loader();
      }
    });
    //send api call to make proper delete
  }

  //control slides here
  slideOptsMobile = {
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
  };


  back() {
    this.item = true;
    this.arrow = true;
    this.product_full = false;
    this.service_full = false;
    this.edit_product = false;
    this.edit_service = false;
  }
  //dismiss modal
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
      data: 'run'
    });
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
          a.dismiss().then(() => console.log('abort loading'));
        }
      });
    });
  }

  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
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

}

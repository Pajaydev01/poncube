import { Component, OnInit, Input } from '@angular/core';
import { PopoverController,NavController,  ModalController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-sub-sub-category',
  templateUrl: './sub-sub-category.page.html',
  styleUrls: ['./sub-sub-category.page.scss'],
})
export class SubSubCategoryPage implements OnInit {
@Input() sub_category:any;
@Input() view:any;
@Input() category_id:any;

viewd:any;

  constructor(
    public popoverController: PopoverController,
    public navy: NavController,
   public modalController: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
const viewer="View all "+this.view;
this.viewd=viewer.toUpperCase();
//console.log(this.viewd)
  }

  //go to store
  check_category(id){
let options: NavigationExtras = {
  queryParams: {
    id:id,
    type:'sub_category',
    name:this.view
  }

}
//console.log(options)
this.popoverController.dismiss({'category':'hi'});
       this.navy.navigateForward(['categories'],options);
  }

  //check_category sub
  check_sub_category(id,name){
    let options: NavigationExtras = {
      queryParams: {
        id:id,
        type:'sub_sub_category',
        name:name
      }
    }
  this.popoverController.dismiss();
           this.navy.navigateForward(['categories'],options);
  }



}

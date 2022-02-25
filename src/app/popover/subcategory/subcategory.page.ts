import { Component, OnInit, Input } from '@angular/core';
import { PopoverController,NavController,  ModalController } from '@ionic/angular';
import {SubSubCategoryPage } from '../sub-sub-category/sub-sub-category.page';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.page.html',
  styleUrls: ['./subcategory.page.scss'],
})
export class SubcategoryPage implements OnInit {
@Input() sub_category:any;
@Input() sub_sub_category:any;
@Input() view:any;
@Input() category_id:any;

viewd:any;

  constructor( public popoverController: PopoverController,  public navy: NavController,
  public modalController: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
const viewer="View all "+this.view;
this.viewd=viewer.toUpperCase();
  }

  //go to store
  check_category(id){
let options: NavigationExtras = {
  queryParams: {
    id:id,
    type:'category',
    name:this.view
  }

}
this.popoverController.dismiss();
       this.navy.navigateForward(['categories'],options);
  }



  async sub(id,ev:any,name){
//get the needed category
const suber=this.sub_sub_category.filter(res=>res.parent_id===id);
//console.log(suber)
if(suber.length===0){
  let options: NavigationExtras = {
    queryParams: {
      id:id,
      type:'sub_category',
      name:name
    }
  }
this.popoverController.dismiss();
         this.navy.navigateForward(['categories'],options);

}
else{
const popover = await this.popoverController.create({
component: SubSubCategoryPage,
cssClass: 'pop-class',
event:ev,
translucent: true,
showBackdrop:true,
componentProps: {
'sub_category':suber,
'view':name,
'category_id':id
}
});
await popover.present();

popover.onDidDismiss().then((data)=>{
//  console.log(data)
  if (data.data!==undefined) {
   (this.popoverController.getTop())?this.popoverController.dismiss():"";
    console.log(this.popoverController.dismiss())
  }
  else{
    console.log(data)
  }
});
//console.log('onDidDismiss resolved with role', role);
  }
//   async dismiss() {
// await this.popoverController.dismiss();
// }
}
}

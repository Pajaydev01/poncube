import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellerViewPageRoutingModule } from './seller-view-routing.module';

import { SellerViewPage } from './seller-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellerViewPageRoutingModule
  ],
  declarations: [SellerViewPage]
})
export class SellerViewPageModule {}

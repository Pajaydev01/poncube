import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellerItemsPageRoutingModule } from './seller-items-routing.module';

import { SellerItemsPage } from './seller-items.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellerItemsPageRoutingModule
  ],
  declarations: [SellerItemsPage]
})
export class SellerItemsPageModule {}

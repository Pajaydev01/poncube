import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FootpagePageModule } from '../footpage/footpage.module';

import { ShopPageRoutingModule } from './shop-routing.module';

import { ShopPage } from './shop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopPageRoutingModule,
    FootpagePageModule
  ],
  declarations: [ShopPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShopPageModule {}

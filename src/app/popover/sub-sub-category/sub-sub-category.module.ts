import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubSubCategoryPageRoutingModule } from './sub-sub-category-routing.module';

import { SubSubCategoryPage } from './sub-sub-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubSubCategoryPageRoutingModule
  ],
  declarations: [SubSubCategoryPage]
})
export class SubSubCategoryPageModule {}

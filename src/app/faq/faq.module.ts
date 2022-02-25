import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqPageRoutingModule } from './faq-routing.module';
import { FootpagePageModule } from '../footpage/footpage.module';
import { FaqPage } from './faq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqPageRoutingModule,
    FootpagePageModule
  ],
  declarations: [FaqPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FaqPageModule {}

import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FootpagePageModule } from '../footpage/footpage.module';
import { PrivacyPageRoutingModule } from './privacy-routing.module';

import { PrivacyPage } from './privacy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacyPageRoutingModule,
      FootpagePageModule
  ],
  declarations: [PrivacyPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrivacyPageModule {}

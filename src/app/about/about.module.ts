import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FootpagePageModule } from '../footpage/footpage.module';
import { AboutPageRoutingModule } from './about-routing.module';

import { AboutPage } from './about.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutPageRoutingModule,
      FootpagePageModule
  ],
  declarations: [AboutPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AboutPageModule {}

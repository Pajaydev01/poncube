import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FootpagePageModule } from '../footpage/footpage.module';
import { TermsPageRoutingModule } from './terms-routing.module';

import { TermsPage } from './terms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsPageRoutingModule,
      FootpagePageModule
  ],
  declarations: [TermsPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TermsPageModule {}

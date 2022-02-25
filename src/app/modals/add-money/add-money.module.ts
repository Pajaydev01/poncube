import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Angular4PaystackModule } from 'angular4-paystack';
import { IonicModule } from '@ionic/angular';

import { AddMoneyPageRoutingModule } from './add-money-routing.module';

import { AddMoneyPage } from './add-money.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMoneyPageRoutingModule,
    Angular4PaystackModule.forRoot('pk_test_26fd4676b5a5d847c70ced4c93968fb9c23c2726'),
  ],
  declarations: [AddMoneyPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddMoneyPageModule {}

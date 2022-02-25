import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FootersPageRoutingModule } from './footers-routing.module';

import { FootersPage } from './footers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FootersPageRoutingModule
  ],
  declarations: [FootersPage]
})
export class FootersPageModule {}

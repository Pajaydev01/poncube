import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellerViewPage } from './seller-view.page';

const routes: Routes = [
  {
    path: '',
    component: SellerViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerViewPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellerItemsPage } from './seller-items.page';

const routes: Routes = [
  {
    path: '',
    component: SellerItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerItemsPageRoutingModule {}

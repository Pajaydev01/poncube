import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubSubCategoryPage } from './sub-sub-category.page';

const routes: Routes = [
  {
    path: '',
    component: SubSubCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubSubCategoryPageRoutingModule {}

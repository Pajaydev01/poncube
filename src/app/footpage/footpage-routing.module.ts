import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootpagePage } from './footpage.page';

const routes: Routes = [
  {
    path: '',
    component: FootpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FootpagePageRoutingModule {}

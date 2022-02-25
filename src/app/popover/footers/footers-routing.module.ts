import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootersPage } from './footers.page';

const routes: Routes = [
  {
    path: '',
    component: FootersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FootersPageRoutingModule {}

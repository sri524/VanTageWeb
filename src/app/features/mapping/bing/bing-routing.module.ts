import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BingComponent } from './bing.component';

const routes: Routes = [{ path: '', component: BingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BingRoutingModule { }

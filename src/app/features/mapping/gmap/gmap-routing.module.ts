import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GmapComponent } from './gmap.component';

const routes: Routes = [{ path: '', component: GmapComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GmapRoutingModule { }
